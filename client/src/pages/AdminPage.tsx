import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { contentSchema, type Content } from "../../../shared/content";
import { api, ApiError, errText, type Loaded } from "../admin/api";
import { pathText, setIn, type SetFn } from "../admin/fields";
import { BackupTab, ImagesTab, MessagesTab, NavTab, PagesTab, SettingsTab } from "../admin/tabs";
import "../admin/admin.css";

const TABS = ["Settings", "Navigation", "Pages", "Images", "Messages", "Backup"] as const;
type Tab = (typeof TABS)[number];

function Login({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await api("login", "POST", { password: new FormData(e.currentTarget).get("password") });
      onDone();
    } catch (err) {
      const s = err instanceof ApiError ? err.status : 0;
      setError(s === 401 ? "Wrong password." : s === 429 ? "Too many tries. Wait a few minutes, then try again." : errText(err));
    }
  }
  return (
    <form className="a-login" onSubmit={submit}>
      <div className="field">
        <label htmlFor="a-pass">Admin password</label>
        <input id="a-pass" name="password" type="password" required autoComplete="current-password" />
      </div>
      <button className="btn btn--primary" type="submit">
        Sign in
      </button>
      <div aria-live="polite">{error && <p className="a-error">{error}</p>}</div>
    </form>
  );
}

function Editor({ onSignOut }: { onSignOut: () => void }) {
  const [saved, setSaved] = useState<Content | null>(null);
  const [draft, setDraft] = useState<Content | null>(null);
  const [rev, setRev] = useState(0); // bump to reset local form state after the draft is replaced from outside
  const [tab, setTab] = useState<Tab>("Settings");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [issues, setIssues] = useState<string[]>([]);

  const replace = useCallback((c: Content, keepDraft = false) => {
    if (!keepDraft) setSaved(c);
    setDraft(c);
    setRev((r) => r + 1);
    setIssues([]);
  }, []);

  useEffect(() => {
    api<Loaded>("content")
      .then((r) => replace(r.content))
      .catch((e) => setStatus(`Could not load content: ${errText(e)}`));
  }, [replace]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set: SetFn = useCallback((path, value) => {
    setDraft((d) => (d ? setIn(d, path, value) : d));
    setStatus("");
  }, []);

  async function save() {
    if (!draft || !saved) return;
    const r = contentSchema.safeParse(draft);
    if (!r.success) {
      setStatus("Not saved. Please fix these first:");
      return setIssues(r.error.issues.slice(0, 6).map((i) => `${pathText(draft, i.path)}: ${i.message}`));
    }
    setBusy(true);
    setIssues([]);
    try {
      const out = await api<Loaded>("content", "PUT", { content: r.data, baseVersion: saved.version });
      setSaved(out.content);
      setDraft(out.content);
      setStatus("Saved. The site is updated.");
    } catch (e) {
      const err = e instanceof ApiError ? e : null;
      if (err?.status === 409) setStatus("Not saved: someone saved a newer version in the meantime. Reload the page to get it (your changes here will be lost).");
      else setStatus(`Not saved: ${errText(e)}`);
      if (err?.fields.length) setIssues(err.fields);
    } finally {
      setBusy(false);
    }
  }

  if (!draft || !saved) return <p role="status">{status || "Loading content…"}</p>;
  const b = "btn btn--small btn--stroke";
  return (
    <>
      <div className="a-bar">
        <button type="button" className="btn btn--small btn--primary" onClick={save} disabled={busy || !dirty}>
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className={b} disabled={!dirty} onClick={() => window.confirm("Throw away all unsaved changes?") && replace(saved)}>
          Discard changes
        </button>
        <span className="a-state">{dirty ? "Unsaved changes" : `All saved (v${saved.version})`}</span>
        <a className={b} href="/" target="_blank" rel="noopener">
          View site
        </a>
        <button type="button" className={b} onClick={() => (!dirty || window.confirm("You have unsaved changes. Sign out anyway?")) && onSignOut()}>
          Sign out
        </button>
      </div>
      <div role="alert">
        {status && <p className="a-msg">{status}</p>}
        {issues.length > 0 && (
          <ul className="a-errors">
            {issues.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        )}
      </div>
      <nav className="a-tabs" aria-label="Admin sections">
        {TABS.map((t) => (
          <button key={t} type="button" className={b} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>
      <section className="a-panel" key={rev}>
        {tab === "Settings" && <SettingsTab doc={draft} set={set} />}
        {tab === "Navigation" && <NavTab doc={draft} set={set} />}
        {tab === "Pages" && <PagesTab doc={draft} set={set} />}
        {tab === "Images" && <ImagesTab />}
        {tab === "Messages" && <MessagesTab />}
        {tab === "Backup" && <BackupTab saved={saved} dirty={dirty} onImport={(c) => replace(c, true)} onReplace={(c) => replace(c)} />}
      </section>
    </>
  );
}

export default function AdminPage() {
  const [state, setState] = useState<"checking" | "out" | "in" | "off">("checking");

  useEffect(() => {
    document.title = "Admin";
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (r) => {
        if (r.status === 503 || !r.headers.get("content-type")?.includes("json")) return setState("off");
        setState(((await r.json()) as { authenticated: boolean }).authenticated ? "in" : "out");
      })
      .catch(() => setState("off"));
  }, []);

  return (
    <main id="main" className="s-content admin">
      <div className="row">
        <div className="column xl-12">
          <p>
            <Link to="/">Back to site</Link>
          </p>
          <h1>Admin</h1>
          {state === "checking" && <p role="status">Checking session…</p>}
          {state === "off" && (
            <p className="a-error">
              The admin is not set up yet. Set ADMIN_PASSWORD_HASH and SESSION_SECRET in Netlify (or run it with netlify dev), then reload.
            </p>
          )}
          {state === "out" && <Login onDone={() => setState("in")} />}
          {state === "in" && (
            <Editor
              onSignOut={async () => {
                await api("logout", "POST").catch(() => undefined);
                setState("out");
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
