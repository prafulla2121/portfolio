import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { ExperienceItem, ProjectItem } from "../types/portfolio";

type Tab = "projects" | "experience" | "messages";
type Message = { id: string; name: string; email: string; message: string; receivedAt: string };
type Field = { name: string; label: string; list?: boolean; long?: boolean; optional?: boolean };

const FIELDS: Record<"projects" | "experience", Field[]> = {
  projects: [
    { name: "title", label: "Title" },
    { name: "category", label: "Category" },
    { name: "description", label: "Description", long: true },
    { name: "tech", label: "Tech stack (one per line)", list: true },
    { name: "repoUrl", label: "Repo URL (https)" },
    { name: "liveUrl", label: "Live URL (optional, https)", optional: true }
  ],
  experience: [
    { name: "title", label: "Role" },
    { name: "company", label: "Company" },
    { name: "period", label: "Period, e.g. Jun 2026 – Present" },
    { name: "location", label: "Location" },
    { name: "points", label: "Highlights (one per line)", list: true }
  ]
};

async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    method,
    credentials: "same-origin",
    headers: body === undefined && method === "GET" ? {} : { "content-type": "application/json" },
    body: body === undefined ? (method === "GET" ? undefined : "{}") : JSON.stringify(body)
  });
  const out = (await res.json().catch(() => ({}))) as T & { error?: string; fields?: string[] };
  if (!res.ok) throw new Error(out.fields?.length ? `${out.error}: ${out.fields.join(", ")}` : out.error ?? `Error ${res.status}`);
  return out;
}

function Login({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await api("login", "POST", { password: new FormData(e.currentTarget).get("password") });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="a-pass">Admin password</label>
        <input id="a-pass" name="password" type="password" required autoComplete="current-password" />
      </div>
      <div>
        <button className="btn btn--primary" type="submit">
          Sign in
        </button>
      </div>
      <div aria-live="polite">{error && <p className="notice is-error">{error}</p>}</div>
    </form>
  );
}

type Item = (ProjectItem | ExperienceItem) & Record<string, unknown>;

function Editor({ tab, item, onSaved, onCancel }: { tab: "projects" | "experience"; item: Item | null; onSaved: () => void; onCancel: () => void }) {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    for (const f of FIELDS[tab]) {
      const v = String(fd.get(f.name) ?? "").trim();
      if (f.list) body[f.name] = v.split("\n").map((s) => s.trim()).filter(Boolean);
      else if (!(f.optional && v === "")) body[f.name] = v;
    }
    try {
      await (item ? api(`${tab}/${encodeURIComponent(item.id)}`, "PUT", body) : api(tab, "POST", body));
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      <h2>{item ? `Edit ${String(item.title)}` : `Add to ${tab}`}</h2>
      {FIELDS[tab].map((f) => {
        const raw = item?.[f.name];
        const value = Array.isArray(raw) ? raw.join("\n") : String(raw ?? "");
        const id = `f-${f.name}`;
        return (
          <div className="field" key={f.name}>
            <label htmlFor={id}>{f.label}</label>
            {f.list || f.long ? (
              <textarea id={id} name={f.name} defaultValue={value} required={!f.optional} />
            ) : (
              <input id={id} type="text" name={f.name} defaultValue={value} required={!f.optional} />
            )}
          </div>
        );
      })}
      <div className="actions">
        <button className="btn btn--primary" type="submit">
          Save
        </button>
        <button className="btn btn--small btn--stroke" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <div aria-live="polite">{error && <p className="notice is-error">{error}</p>}</div>
    </form>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("projects");
  const [items, setItems] = useState<Item[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      if (tab === "messages") setMessages((await api<{ items: Message[] }>("messages")).items);
      else setItems((await api<{ items: Item[] }>(tab)).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    }
  };

  useEffect(() => {
    setEditing(null);
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function remove(item: Item) {
    if (!window.confirm(`Delete "${String(item.title)}"? This cannot be undone.`)) return;
    try {
      await api(`${tab}/${encodeURIComponent(item.id)}`, "DELETE");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <>
      <div className="admin-bar" role="group" aria-label="Sections">
        {(["projects", "experience", "messages"] as Tab[]).map((t) => (
          <button key={t} type="button" className="btn btn--small btn--stroke" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button type="button" className="btn btn--small btn--stroke" onClick={onSignOut}>
          Sign out
        </button>
      </div>
      <div aria-live="polite">{error && <p className="notice is-error">{error}</p>}</div>

      {tab === "messages" ? (
        <ul className="admin-list">
          {messages.length === 0 && <li>No messages yet. They appear here when someone uses the contact form.</li>}
          {messages.map((m) => (
            <li key={m.id} className="message">
              <strong>{m.name}</strong> <a href={`mailto:${m.email}`}>{m.email}</a>{" "}
              <span className="meta">{new Date(m.receivedAt).toLocaleString()}</span>
              <p>{m.message}</p>
            </li>
          ))}
        </ul>
      ) : editing ? (
        <Editor
          tab={tab}
          item={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      ) : (
        <>
          <ul className="admin-list">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  <strong>{String(item.title)}</strong> {"company" in item ? `at ${String(item.company)}` : ""}
                </span>
                <span className="admin-actions">
                  <button type="button" className="btn btn--small btn--stroke" onClick={() => setEditing(item)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn--small btn--stroke" onClick={() => remove(item)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--primary" onClick={() => setEditing("new")}>
            Add {tab === "projects" ? "project" : "role"}
          </button>
        </>
      )}
    </>
  );
}

export default function AdminPage() {
  const [state, setState] = useState<"checking" | "out" | "in" | "off">("checking");

  const check = () =>
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (r) => {
        if (r.status === 503 || !r.headers.get("content-type")?.includes("json")) return setState("off");
        setState(((await r.json()) as { authenticated: boolean }).authenticated ? "in" : "out");
      })
      .catch(() => setState("off"));

  useEffect(() => {
    document.title = "Admin | Prafulla Purohit";
    void check();
  }, []);

  return (
    <main id="main" className="s-content admin">
      <div className="row width-narrower pagemain">
      <div className="column xl-12">
      <p>
        <Link to="/">Back to site</Link>
      </p>
      <h1>Admin</h1>
      <div>
        {state === "checking" && <p>Checking session…</p>}
        {state === "off" && (
          <p className="notice is-error">
            The admin API is not reachable or not configured. Set ADMIN_PASSWORD_HASH and SESSION_SECRET in Netlify, or run
            it with netlify dev.
          </p>
        )}
        {state === "out" && <Login onDone={() => setState("in")} />}
        {state === "in" && (
          <Dashboard
            onSignOut={async () => {
              await api("logout", "POST").catch(() => undefined);
              setState("out");
            }}
          />
        )}
      </div>
      </div>
      </div>
    </main>
  );
}
