import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { handle, makeSession, verifySession, type Deps, type KV } from "../lib/api.ts";

const ORIGIN = "https://example.netlify.app";
const SECRET = "x".repeat(40);
const HASH = bcrypt.hashSync("correct horse", 4);

function memoryDeps(ip = "1.2.3.4"): Deps {
  const stores = new Map<string, Map<string, unknown>>();
  const store = (name: string): KV => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name)!;
    return {
      get: async (k) => (m.has(k) ? structuredClone(m.get(k)) : null),
      setJSON: async (k, v) => void m.set(k, structuredClone(v)),
      list: async (o) => ({ blobs: [...m.keys()].filter((k) => k.startsWith(o?.prefix ?? "")).sort().map((key) => ({ key })) })
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
  return new Request(ORIGIN + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
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

const project = {
  title: "Test project",
  category: "Test",
  description: "Description",
  tech: ["TS"],
  repoUrl: "https://github.com/prafulla2121/portfolio"
};

test("public content falls back to seed data", async () => {
  const res = await handle(req("/api/content"), memoryDeps());
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.profile.name, "Prafulla Purohit");
  assert.ok(body.projects.length >= 4);
});

test("admin writes fail without a session", async () => {
  const deps = memoryDeps();
  for (const [path, method] of [
    ["/api/admin/projects", "POST"],
    ["/api/admin/projects/documind", "PUT"],
    ["/api/admin/projects/documind", "DELETE"],
    ["/api/admin/experience", "POST"]
  ]) {
    const res = await handle(req(path, method, project), deps);
    assert.equal(res.status, 401, `${method} ${path}`);
  }
  assert.equal((await handle(req("/api/admin/messages"), deps)).status, 401);
});

test("forged or expired session is rejected", async () => {
  const deps = memoryDeps();
  const forged = makeSession("y".repeat(40), Date.now());
  const res = await handle(req("/api/admin/projects", "POST", project, { cookie: `__Host-session=${forged}` }), deps);
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
  const evil = await handle(req("/api/admin/projects", "POST", project, { cookie, origin: "https://evil.example" }), deps);
  assert.equal(evil.status, 403);
  const form = await handle(req("/api/admin/projects", "POST", project, { cookie, "content-type": "text/plain" }), deps);
  assert.equal(form.status, 403);
});

test("CRUD works with a session and validates input", async () => {
  const deps = memoryDeps();
  const cookie = await login(deps);
  const bad = await handle(req("/api/admin/projects", "POST", { ...project, repoUrl: "javascript:alert(1)" }, { cookie }), deps);
  assert.equal(bad.status, 400);

  const created = await handle(req("/api/admin/projects", "POST", project, { cookie }), deps);
  assert.equal(created.status, 201);
  const { item } = await created.json();

  const updated = await handle(req(`/api/admin/projects/${item.id}`, "PUT", { ...project, title: "Renamed" }, { cookie }), deps);
  assert.equal(updated.status, 200);
  const content = await (await handle(req("/api/content"), deps)).json();
  assert.ok(content.projects.some((p: { title: string }) => p.title === "Renamed"));

  const del = await handle(req(`/api/admin/projects/${item.id}`, "DELETE", undefined, { cookie, origin: ORIGIN, "content-type": "application/json" }), deps);
  assert.equal(del.status, 200);
});

test("contact form validates, stores, rate-limits, and admin can read it", async () => {
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
});

test("admin returns 503 when env vars are missing", async () => {
  const deps = { ...memoryDeps(), env: {} };
  assert.equal((await handle(req("/api/admin/login", "POST", { password: "x" }), deps)).status, 503);
});
