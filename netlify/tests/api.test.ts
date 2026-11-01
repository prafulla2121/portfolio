import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { handle, makeSession, verifySession, type Deps, type KV } from "../lib/api.ts";
import { seed } from "../../shared/seed.ts";
import { contentSchema } from "../../shared/content.ts";

const ORIGIN = "https://example.netlify.app";
const SECRET = "x".repeat(40);
const HASH = bcrypt.hashSync("correct horse", 4);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);

function memoryDeps(ip = "1.2.3.4"): Deps {
  const stores = new Map<string, Map<string, unknown>>();
  const store = (name: string): KV => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name)!;
    return {
      get: (async (k: string) => (m.has(k) ? structuredClone(m.get(k)) : null)) as KV["get"],
      set: async (k, v) => void m.set(k, v),
      setJSON: async (k, v) => void m.set(k, structuredClone(v)),
      list: async (o) => ({ blobs: [...m.keys()].filter((k) => k.startsWith(o?.prefix ?? "")).sort().map((key) => ({ key })) }),
      delete: async (k) => void m.delete(k)
    };
  };
  return { store, env: { ADMIN_PASSWORD_HASH: HASH, SESSION_SECRET: SECRET }, ip };
}

function req(path: string, method = "GET", body?: unknown, headers: Record<string, string> = {}): Request {
  const h: Record<string, string> = { ...headers };
  if (body !== undefined) {
    h["content-type"] ??= "application/json";
    h.origin ??= ORIGIN;
  }
  const payload = body === undefined ? undefined : body instanceof Uint8Array ? body : JSON.stringify(body);
  return new Request(ORIGIN + path, { method, headers: h, body: payload as BodyInit | undefined });
}

async function login(deps: Deps): Promise<string> {
  const res = await handle(req("/api/admin/login", "POST", { password: "correct horse" }), deps);
  assert.equal(res.status, 200);
  const cookie = res.headers.get("set-cookie")!;
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  return cookie.split(";")[0];
}

test("seed document is valid", () => {
  assert.ok(contentSchema.safeParse(seed).success);
});

test("public content falls back to the seed", async () => {
  const res = await handle(req("/api/content"), memoryDeps());
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.settings.name, "Prafulla Purohit");
  assert.ok(body.pages.length >= 5);
});

test("admin writes fail without a session", async () => {
  const deps = memoryDeps();
  const cases: Array<[string, string, unknown]> = [
    ["/api/admin/content", "PUT", { content: seed, baseVersion: 1 }],
    ["/api/admin/content/reset", "POST", {}],
    ["/api/admin/content/restore", "POST", { version: 1 }],
    ["/api/admin/messages/000000000000001-abcdef12", "DELETE", {}],
    ["/api/admin/images/0123456789abcdef0123456789abcdef", "DELETE", {}]
  ];
  for (const [path, method, body] of cases) {
    assert.equal((await handle(req(path, method, body), deps)).status, 401, `${method} ${path}`);
  }
  const upload = await handle(req("/api/admin/images", "POST", PNG, { "content-type": "image/png" }), deps);
  assert.equal(upload.status, 401);
  assert.equal((await handle(req("/api/admin/content"), deps)).status, 401);
  assert.equal((await handle(req("/api/admin/messages"), deps)).status, 401);
});

test("forged or expired session is rejected", async () => {
  const deps = memoryDeps();
  const forged = makeSession("y".repeat(40), Date.now());
  const res = await handle(req("/api/admin/content", "PUT", { content: seed, baseVersion: 1 }, { cookie: `__Host-session=${forged}` }), deps);
  assert.equal(res.status, 401);
  assert.equal(verifySession(makeSession(SECRET, 0), SECRET, Date.now()), false);
});

test("wrong password is refused and login is rate-limited", async () => {
  const deps = memoryDeps();
  for (let i = 0; i < 5; i++) {
    assert.equal((await handle(req("/api/admin/login", "POST", { password: "nope" }), deps)).status, 401);
  }
  assert.equal((await handle(req("/api/admin/login", "POST", { password: "correct horse" }), deps)).status, 429);
});

test("cross-origin and non-JSON writes are refused (CSRF)", async () => {
  const deps = memoryDeps();
  const cookie = await login(deps);
  const body = { content: seed, baseVersion: 1 };
  assert.equal((await handle(req("/api/admin/content", "PUT", body, { cookie, origin: "https://evil.example" }), deps)).status, 403);
  assert.equal((await handle(req("/api/admin/content", "PUT", body, { cookie, "content-type": "text/plain" }), deps)).status, 403);
});

test("content save validates, versions, keeps history and can restore", async () => {
  const deps = memoryDeps();
  const cookie = await login(deps);

  const bad = structuredClone(seed);
  bad.settings.nav[0].link = "javascript:alert(1)";
  assert.equal((await handle(req("/api/admin/content", "PUT", { content: bad, baseVersion: 1 }, { cookie }), deps)).status, 400);

  const next = structuredClone(seed);
  next.settings.siteTitle = "Changed title";
  const saved = await handle(req("/api/admin/content", "PUT", { content: next, baseVersion: 1 }, { cookie }), deps);
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).content.version, 2);

  const pub = await (await handle(req("/api/content"), deps)).json();
  assert.equal(pub.settings.siteTitle, "Changed title");

  const stale = await handle(req("/api/admin/content", "PUT", { content: next, baseVersion: 1 }, { cookie }), deps);
  assert.equal(stale.status, 409);

  const history = await (await handle(req("/api/admin/content/history", "GET", undefined, { cookie }), deps)).json();
  assert.deepEqual(history.items.map((i: { version: number }) => i.version), [1]);

  const restored = await handle(req("/api/admin/content/restore", "POST", { version: 1 }, { cookie }), deps);
  const r = await restored.json();
  assert.equal(r.content.version, 3);
  assert.equal(r.content.settings.siteTitle, seed.settings.siteTitle);

  const reset = await (await handle(req("/api/admin/content/reset", "POST", {}, { cookie }), deps)).json();
  assert.equal(reset.content.version, 4);
});

test("image upload checks type and size, serves the file, and deletes", async () => {
  const deps = memoryDeps();
  const cookie = await login(deps);
  const svg = await handle(req("/api/admin/images", "POST", new TextEncoder().encode("<svg/>"), { cookie, "content-type": "image/svg+xml" }), deps);
  assert.equal(svg.status, 415);
  const fake = await handle(req("/api/admin/images", "POST", new TextEncoder().encode("not a png"), { cookie, "content-type": "image/png" }), deps);
  assert.equal(fake.status, 415);
  const big = new Uint8Array(2 * 1024 * 1024 + 1);
  big.set(PNG);
  assert.equal((await handle(req("/api/admin/images", "POST", big, { cookie, "content-type": "image/png" }), deps)).status, 413);

  const ok = await handle(req("/api/admin/images", "POST", PNG, { cookie, "content-type": "image/png" }), deps);
  assert.equal(ok.status, 201);
  const { id, url } = await ok.json();
  const served = await handle(req(url), deps);
  assert.equal(served.status, 200);
  assert.equal(served.headers.get("content-type"), "image/png");
  assert.equal(served.headers.get("x-content-type-options"), "nosniff");

  assert.equal((await handle(req(`/api/admin/images/${id}`, "DELETE", {}, { cookie }), deps)).status, 200);
  assert.equal((await handle(req(url), deps)).status, 404);
});

test("contact form validates, stores, rate-limits; admin reads and deletes messages", async () => {
  const deps = memoryDeps("9.9.9.9");
  assert.equal((await handle(req("/api/contact", "POST", { name: "A", email: "bad", message: "hi" }), deps)).status, 400);
  const msg = { name: "Ana", email: "ana@example.com", message: "Hello" };
  assert.equal((await handle(req("/api/contact", "POST", msg), deps)).status, 201);
  assert.equal((await handle(req("/api/contact", "POST", msg), deps)).status, 201);
  assert.equal((await handle(req("/api/contact", "POST", msg), deps)).status, 429);

  const cookie = await login(deps);
  const list = await (await handle(req("/api/admin/messages", "GET", undefined, { cookie }), deps)).json();
  assert.equal(list.items.length, 2);
  assert.equal(list.items[0].email, "ana@example.com");
  assert.equal((await handle(req(`/api/admin/messages/${list.items[0].id}`, "DELETE", {}, { cookie }), deps)).status, 200);
  const after = await (await handle(req("/api/admin/messages", "GET", undefined, { cookie }), deps)).json();
  assert.equal(after.items.length, 1);
});

test("admin returns 503 when env vars are missing", async () => {
  const deps = { ...memoryDeps(), env: {} };
  assert.equal((await handle(req("/api/admin/login", "POST", { password: "x" }), deps)).status, 503);
});
