import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { contentSchema, type Content } from "../../shared/content.ts";
import { seed } from "../../shared/seed.ts";

// The subset of a Netlify Blobs store this API uses. Tests pass an in-memory version.
export interface KV {
  get(key: string, opts: { type: "json" }): Promise<unknown>;
  get(key: string, opts: { type: "arrayBuffer" }): Promise<ArrayBuffer | null>;
  set(key: string, value: ArrayBuffer): Promise<unknown>;
  setJSON(key: string, value: unknown): Promise<unknown>;
  list(opts?: { prefix?: string }): Promise<{ blobs: Array<{ key: string }> }>;
  delete(key: string): Promise<unknown>;
}

export type StoreName = "content" | "messages" | "ratelimit" | "images";

export interface Deps {
  store: (name: StoreName) => KV;
  env: Record<string, string | undefined>;
  ip: string;
  now?: () => number;
}

const COOKIE = "__Host-session";
const SESSION_MS = 8 * 60 * 60 * 1000;
const MAX_JSON = 20_000;
const MAX_CONTENT = 600_000;
const MAX_IMAGE = 2 * 1024 * 1024;
const HISTORY_KEEP = 20;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(1).max(4000),
  website: z.string().max(0).optional() // honeypot: real people leave it empty
});

const IMAGE_TYPES: Record<string, (b: Uint8Array) => boolean> = {
  "image/png": (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/gif": (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38,
  "image/webp": (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP"
};

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...headers }
  });

const issues = (e: z.ZodError) => e.issues.slice(0, 10).map((i) => `${i.path.join(".")}: ${i.message}`);

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function makeSession(secret: string, now: number): string {
  const payload = b64(JSON.stringify({ exp: now + SESSION_MS }));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySession(token: string | undefined, secret: string, now: number): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

function readCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

async function readJson(req: Request, max = MAX_JSON): Promise<unknown> {
  const raw = await req.text();
  if (raw.length > max) throw new HttpError(413, `Request body must be under ${Math.round(max / 1000)} KB`);
  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, "Request body must be JSON");
  }
}

// shortcut: read-then-write counter is not atomic, so bursts can slip a few extra tries; fine for one admin.
async function rateLimited(deps: Deps, bucket: string, limit: number, windowMs: number): Promise<boolean> {
  const store = deps.store("ratelimit");
  const key = `${bucket}/${(deps.ip || "unknown").replace(/[^0-9a-fA-F.]/g, "_")}`;
  const now = (deps.now ?? Date.now)();
  const cur = (await store.get(key, { type: "json" })) as { count: number; reset: number } | null;
  const next = !cur || cur.reset < now ? { count: 1, reset: now + windowMs } : { count: cur.count + 1, reset: cur.reset };
  await store.setJSON(key, next);
  return next.count > limit;
}

export async function readContent(deps: Deps): Promise<Content> {
  const saved = await deps.store("content").get("doc", { type: "json" });
  const parsed = saved ? contentSchema.safeParse(saved) : null;
  return parsed?.success ? parsed.data : seed;
}

const pad = (n: number) => String(n).padStart(8, "0");

// Saves a new version and keeps the previous one in history (last HISTORY_KEEP).
async function saveContent(deps: Deps, next: Content, current: Content): Promise<Content> {
  const store = deps.store("content");
  const doc: Content = { ...next, version: current.version + 1, updatedAt: new Date((deps.now ?? Date.now)()).toISOString() };
  await store.setJSON(`history/${pad(current.version)}`, current);
  await store.setJSON("doc", doc);
  const { blobs } = await store.list({ prefix: "history/" });
  const old = blobs.map((b) => b.key).sort().slice(0, -HISTORY_KEEP);
  await Promise.all(old.map((k) => store.delete(k)));
  return doc;
}

async function handleContentAdmin(req: Request, deps: Deps, sub: string | undefined): Promise<Response> {
  const current = await readContent(deps);
  if (!sub && req.method === "GET") return json({ content: current });

  if (!sub && req.method === "PUT") {
    const body = (await readJson(req, MAX_CONTENT)) as { content?: unknown; baseVersion?: unknown };
    if (body.baseVersion !== current.version) {
      return json({ error: "Someone saved a newer version. Reload, then make your change again.", version: current.version }, 409);
    }
    const parsed = contentSchema.safeParse(body.content);
    if (!parsed.success) return json({ error: "Invalid content", fields: issues(parsed.error) }, 400);
    return json({ content: await saveContent(deps, parsed.data, current) });
  }

  if (sub === "reset" && req.method === "POST") return json({ content: await saveContent(deps, seed, current) });

  if (sub === "history" && req.method === "GET") {
    const store = deps.store("content");
    const { blobs } = await store.list({ prefix: "history/" });
    const docs = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<Content | null>));
    const items = docs.filter((d): d is Content => !!d).map((d) => ({ version: d.version, updatedAt: d.updatedAt }));
    return json({ items: items.sort((a, b) => b.version - a.version) });
  }

  if (sub === "restore" && req.method === "POST") {
    const { version } = (await readJson(req)) as { version?: unknown };
    if (typeof version !== "number" || !Number.isInteger(version)) return json({ error: "version must be a number" }, 400);
    const old = await deps.store("content").get(`history/${pad(version)}`, { type: "json" });
    const parsed = old ? contentSchema.safeParse(old) : null;
    if (!parsed?.success) return json({ error: "That version is not in the history" }, 404);
    return json({ content: await saveContent(deps, parsed.data, current) });
  }
  return json({ error: "Not found" }, 404);
}

async function handleImagesAdmin(req: Request, deps: Deps, id: string | undefined): Promise<Response> {
  const store = deps.store("images");
  if (!id && req.method === "GET") {
    const { blobs } = await store.list({ prefix: "meta/" });
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    return json({ items: items.filter(Boolean).reverse() });
  }
  if (!id && req.method === "POST") {
    const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const check = IMAGE_TYPES[type];
    if (!check) return json({ error: "Upload a PNG, JPEG, WebP or GIF image" }, 415);
    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_IMAGE) return json({ error: "Images must be 2 MB or smaller" }, 413);
    const bytes = new Uint8Array(await req.arrayBuffer());
    if (bytes.byteLength === 0) return json({ error: "The file is empty" }, 400);
    if (bytes.byteLength > MAX_IMAGE) return json({ error: "Images must be 2 MB or smaller" }, 413);
    if (!check(bytes)) return json({ error: "The file content does not match its image type" }, 415);
    const newId = randomUUID().replace(/-/g, "");
    const meta = { id: newId, url: `/api/images/${newId}`, type, size: bytes.byteLength, uploadedAt: new Date((deps.now ?? Date.now)()).toISOString() };
    await store.set(`img/${newId}`, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
    await store.setJSON(`meta/${String((deps.now ?? Date.now)()).padStart(15, "0")}-${newId}`, meta);
    return json(meta, 201);
  }
  if (id && req.method === "DELETE") {
    if (!/^[0-9a-f]{32}$/.test(id)) return json({ error: "Not found" }, 404);
    const { blobs } = await store.list({ prefix: "meta/" });
    const metaKey = blobs.map((b) => b.key).find((k) => k.endsWith(`-${id}`));
    if (!metaKey) return json({ error: "Not found" }, 404);
    await Promise.all([store.delete(`img/${id}`), store.delete(metaKey)]);
    return json({ ok: true });
  }
  return json({ error: "Not found" }, 404);
}

async function handleMessagesAdmin(req: Request, deps: Deps, id: string | undefined): Promise<Response> {
  const store = deps.store("messages");
  if (!id && req.method === "GET") {
    const { blobs } = await store.list({ prefix: "msg/" });
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    return json({ items: items.filter(Boolean).reverse() });
  }
  if (id && req.method === "DELETE") {
    if (!/^[0-9]{15}-[0-9a-f]{8}$/.test(id)) return json({ error: "Not found" }, 404);
    await store.delete(`msg/${id}`);
    return json({ ok: true });
  }
  return json({ error: "Not found" }, 404);
}

async function serveImage(deps: Deps, id: string | undefined): Promise<Response> {
  if (!id || !/^[0-9a-f]{32}$/.test(id)) return json({ error: "Not found" }, 404);
  const store = deps.store("images");
  const { blobs } = await store.list({ prefix: "meta/" });
  const metaKey = blobs.map((b) => b.key).find((k) => k.endsWith(`-${id}`));
  const meta = metaKey ? ((await store.get(metaKey, { type: "json" })) as { type: string } | null) : null;
  const data = meta ? await store.get(`img/${id}`, { type: "arrayBuffer" }) : null;
  if (!meta || !data || !IMAGE_TYPES[meta.type]) return json({ error: "Not found" }, 404);
  return new Response(data, {
    headers: {
      "content-type": meta.type,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; sandbox"
    }
  });
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  const now = (deps.now ?? Date.now)();
  const parts = new URL(req.url).pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const isWrite = req.method !== "GET" && req.method !== "HEAD";
  const isUpload = parts[0] === "admin" && parts[1] === "images" && req.method === "POST" && !parts[2];

  try {
    if (parts[0] === "content" && req.method === "GET") return json(await readContent(deps));
    if (parts[0] === "images" && req.method === "GET") return await serveImage(deps, parts[1]);

    // CSRF: the session cookie is SameSite=Strict, and every write must come from our own origin,
    // as JSON (or as an image body for the one upload route), which a cross-site form cannot send.
    if (isWrite) {
      const sameOrigin = req.headers.get("origin") === new URL(req.url).origin;
      const ctype = req.headers.get("content-type") ?? "";
      if (!sameOrigin || !(isUpload ? ctype.startsWith("image/") : ctype.startsWith("application/json"))) {
        return json({ error: "Cross-origin or wrong content type refused" }, 403);
      }
    }

    if (parts[0] === "contact" && req.method === "POST") {
      if (await rateLimited(deps, "contact", 3, 60 * 60 * 1000)) return json({ error: "Too many messages. Try again in an hour." }, 429);
      const parsed = contactSchema.safeParse(await readJson(req));
      if (!parsed.success) return json({ error: "Check the form", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
      if (parsed.data.website) return json({ ok: true }); // bot: pretend success, store nothing
      // numeric, sortable, filesystem-safe key (the local blob sandbox stores keys as file names)
      const id = `${String(now).padStart(15, "0")}-${randomUUID().slice(0, 8)}`;
      const { name, email, message } = parsed.data;
      await deps.store("messages").setJSON(`msg/${id}`, { id, name, email, message, receivedAt: new Date(now).toISOString() });
      return json({ ok: true }, 201);
    }

    if (parts[0] !== "admin") return json({ error: "Not found" }, 404);

    const hash = deps.env.ADMIN_PASSWORD_HASH;
    const secret = deps.env.SESSION_SECRET;
    if (!hash || !secret || secret.length < 32) return json({ error: "Admin is not configured on the server" }, 503);

    if (parts[1] === "login" && req.method === "POST") {
      if (await rateLimited(deps, "login", 5, 15 * 60 * 1000)) return json({ error: "Too many attempts. Wait 15 minutes." }, 429);
      const body = (await readJson(req)) as { password?: unknown };
      const ok = typeof body.password === "string" && body.password.length <= 200 && (await bcrypt.compare(body.password, hash));
      if (!ok) return json({ error: "Wrong password" }, 401);
      const cookie = `${COOKIE}=${makeSession(secret, now)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MS / 1000}`;
      return json({ ok: true }, 200, { "set-cookie": cookie });
    }
    if (parts[1] === "logout" && req.method === "POST") {
      return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
    }

    const authed = verifySession(readCookie(req, COOKIE), secret, now);
    if (parts[1] === "session" && req.method === "GET") return json({ authenticated: authed });
    if (!authed) return json({ error: "Sign in first" }, 401);

    if (parts[1] === "content") return await handleContentAdmin(req, deps, parts[2]);
    if (parts[1] === "images") return await handleImagesAdmin(req, deps, parts[2]);
    if (parts[1] === "messages") return await handleMessagesAdmin(req, deps, parts[2]);
    return json({ error: "Not found" }, 404);
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error("api error", err);
    return json({ error: "Server error" }, 500);
  }
}
