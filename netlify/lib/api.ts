import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { portfolioData } from "../../client/src/data.ts";

// The subset of a Netlify Blobs store this API uses. Tests pass an in-memory version.
export interface KV {
  get(key: string, opts: { type: "json" }): Promise<unknown>;
  setJSON(key: string, value: unknown): Promise<unknown>;
  list(opts?: { prefix?: string }): Promise<{ blobs: Array<{ key: string }> }>;
}

export interface Deps {
  store: (name: "content" | "messages" | "ratelimit") => KV;
  env: Record<string, string | undefined>;
  ip: string;
  now?: () => number;
}

const COOKIE = "__Host-session";
const SESSION_MS = 8 * 60 * 60 * 1000;
const MAX_BODY = 20_000;

const text = (max: number) => z.string().trim().min(1).max(max);
const list = (max: number) => z.array(text(500)).min(1).max(max);
const httpsUrl = z.url({ protocol: /^https$/ }).max(300);

const schemas = {
  projects: z.object({
    title: text(80),
    category: text(60),
    description: text(800),
    tech: z.array(text(40)).min(1).max(15),
    repoUrl: httpsUrl,
    liveUrl: httpsUrl.optional().or(z.literal("").transform(() => undefined))
  }),
  experience: z.object({
    title: text(80),
    company: text(80),
    period: text(60),
    location: text(60),
    points: list(10)
  })
} as const;

const contactSchema = z.object({
  name: text(100),
  email: z.email().max(200),
  message: text(4000),
  website: z.string().max(0).optional() // honeypot: real people leave it empty
});

type Collection = keyof typeof schemas;
type Item = { id: string } & Record<string, unknown>;

const json = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...headers }
  });

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

// CSRF: the cookie is SameSite=Strict, and every write must also come from our own origin as JSON.
function sameOriginJson(req: Request): boolean {
  const origin = req.headers.get("origin");
  return origin === new URL(req.url).origin && (req.headers.get("content-type") ?? "").startsWith("application/json");
}

async function readBody(req: Request): Promise<unknown> {
  const raw = await req.text();
  if (raw.length > MAX_BODY) throw new Error("too large");
  return JSON.parse(raw);
}

// shortcut: read-then-write counter is not atomic, so bursts can slip a few extra tries; fine for one admin.
async function rateLimited(deps: Deps, bucket: string, limit: number, windowMs: number): Promise<boolean> {
  const store = deps.store("ratelimit");
  const key = `${bucket}/${deps.ip || "unknown"}`;
  const now = (deps.now ?? Date.now)();
  const cur = (await store.get(key, { type: "json" })) as { count: number; reset: number } | null;
  const next = !cur || cur.reset < now ? { count: 1, reset: now + windowMs } : { count: cur.count + 1, reset: cur.reset };
  await store.setJSON(key, next);
  return next.count > limit;
}

async function readCollection(deps: Deps, name: Collection): Promise<Item[]> {
  const saved = (await deps.store("content").get(name, { type: "json" })) as Item[] | null;
  return saved ?? (portfolioData[name] as unknown as Item[]);
}

async function handleAdmin(req: Request, deps: Deps, path: string[]): Promise<Response> {
  const [collection, id] = path;

  if (collection === "messages" && req.method === "GET") {
    const store = deps.store("messages");
    const { blobs } = await store.list({ prefix: "msg/" });
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    return json({ items: items.filter(Boolean).reverse() });
  }

  if (collection !== "projects" && collection !== "experience") return json({ error: "Not found" }, 404);
  const items = await readCollection(deps, collection);

  if (req.method === "GET" && !id) return json({ items });
  if (req.method === "DELETE" && id) {
    if (!items.some((i) => i.id === id)) return json({ error: "Not found" }, 404);
    await deps.store("content").setJSON(collection, items.filter((i) => i.id !== id));
    return json({ ok: true });
  }
  if ((req.method === "POST" && !id) || (req.method === "PUT" && id)) {
    const parsed = schemas[collection].safeParse(await readBody(req));
    if (!parsed.success) {
      return json({ error: "Invalid input", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
    }
    if (req.method === "PUT" && !items.some((i) => i.id === id)) return json({ error: "Not found" }, 404);
    const saved: Item = { ...parsed.data, id: id ?? randomUUID() };
    const next = id ? items.map((i) => (i.id === id ? saved : i)) : [...items, saved];
    await deps.store("content").setJSON(collection, next);
    return json({ item: saved }, id ? 200 : 201);
  }
  return json({ error: "Method not allowed" }, 405);
}

export async function handle(req: Request, deps: Deps): Promise<Response> {
  const now = (deps.now ?? Date.now)();
  const parts = new URL(req.url).pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const isWrite = req.method !== "GET" && req.method !== "HEAD";

  try {
    if (parts[0] === "content" && req.method === "GET") {
      const [projects, experience] = await Promise.all([
        readCollection(deps, "projects"),
        readCollection(deps, "experience")
      ]);
      return json({ ...portfolioData, projects, experience });
    }

    if (isWrite && !sameOriginJson(req)) return json({ error: "Cross-origin or non-JSON request refused" }, 403);

    if (parts[0] === "contact" && req.method === "POST") {
      if (await rateLimited(deps, "contact", 3, 60 * 60 * 1000)) return json({ error: "Too many messages. Try again in an hour." }, 429);
      const parsed = contactSchema.safeParse(await readBody(req));
      if (!parsed.success) {
        return json({ error: "Check the form", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
      }
      if (parsed.data.website) return json({ ok: true }); // bot: pretend success, store nothing
      // numeric, sortable, filesystem-safe key (the local blob sandbox stores keys as file names)
      const id = `msg/${String(now).padStart(15, "0")}-${randomUUID().slice(0, 8)}`;
      const { name, email, message } = parsed.data;
      await deps.store("messages").setJSON(id, { id, name, email, message, receivedAt: new Date(now).toISOString() });
      return json({ ok: true }, 201);
    }

    if (parts[0] !== "admin") return json({ error: "Not found" }, 404);

    const hash = deps.env.ADMIN_PASSWORD_HASH;
    const secret = deps.env.SESSION_SECRET;
    if (!hash || !secret || secret.length < 32) return json({ error: "Admin is not configured on the server" }, 503);

    if (parts[1] === "login" && req.method === "POST") {
      if (await rateLimited(deps, "login", 5, 15 * 60 * 1000)) return json({ error: "Too many attempts. Wait 15 minutes." }, 429);
      const body = (await readBody(req)) as { password?: unknown };
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
    return await handleAdmin(req, deps, parts.slice(1));
  } catch (err) {
    if (err instanceof SyntaxError || (err instanceof Error && err.message === "too large")) {
      return json({ error: "Request body must be JSON under 20 KB" }, 400);
    }
    console.error("api error", err);
    return json({ error: "Server error" }, 500);
  }
}
