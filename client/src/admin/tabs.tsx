import { useEffect, useState, type ChangeEvent } from "react";
import { contentSchema, pageSchema, sectionSchema, type Content } from "../../../shared/content";
import { api, errText, IMAGE_TYPES, uploadImage, type Img, type Loaded, type Message } from "./api";
import { Field, Fields, pathText, slugify, uniqueId, type SetFn } from "./fields";
import { ANIM, NAV, PAGES, SETTINGS, THEME } from "./specs";

type EditProps = { doc: Content; set: SetFn };
const btn = "btn btn--small btn--stroke";
const Status = ({ msg }: { msg: string }) => <div aria-live="polite">{msg && <p className="a-msg">{msg}</p>}</div>;

export function SettingsTab({ doc, set }: EditProps) {
  return (
    <>
      <h2>Site</h2>
      <Fields specs={SETTINGS} value={doc.settings} path={["settings"]} set={set} />
      <h2>Theme</h2>
      <Fields specs={THEME} value={doc.settings.theme} path={["settings", "theme"]} set={set} />
      <h2>Animations</h2>
      <Fields specs={ANIM} value={doc.settings.animations} path={["settings", "animations"]} set={set} />
    </>
  );
}

export function NavTab({ doc, set }: EditProps) {
  const [page, setPage] = useState(0);
  const nav = doc.settings.nav;
  const addPage = () => {
    const p = doc.pages[page];
    if (!p) return;
    set(["settings", "nav"], [...nav, { id: uniqueId(p.slug || "home", nav.map((n) => n.id)), label: p.title, link: `/${p.slug}`, visible: true }]);
  };
  return (
    <>
      <Field spec={{ k: "nav", label: "Menu links", kind: "list", list: NAV }} value={nav} path={["settings", "nav"]} set={set} />
      <div className="a-btns">
        <label htmlFor="a-navpage">Quick add a link to a page:</label>
        <select id="a-navpage" value={page} onChange={(e) => setPage(Number(e.target.value))}>
          {doc.pages.map((p, i) => (
            <option key={p.id} value={i}>
              {p.title} (/{p.slug})
            </option>
          ))}
        </select>
        <button type="button" className={btn} onClick={addPage}>
          Add page link
        </button>
      </div>
    </>
  );
}

export function PagesTab({ doc, set }: EditProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState<string | null>(null); // null = follow the title
  const [toNav, setToNav] = useState(true);
  const [msg, setMsg] = useState("");
  const finalSlug = slug ?? slugify(title);

  const add = () => {
    if (!title.trim()) return setMsg("Give the page a title.");
    if (!/^[a-z0-9-]+$/.test(finalSlug)) return setMsg("The address can only use lowercase letters, digits and dashes.");
    if (doc.pages.some((p) => p.slug === finalSlug)) return setMsg(`A page with the address /${finalSlug} already exists.`);
    const page = pageSchema.parse({
      id: uniqueId(finalSlug, doc.pages.map((p) => p.id)),
      slug: finalSlug,
      title: title.trim(),
      sections: [sectionSchema.parse({ id: "text", type: "text", title: title.trim() })]
    });
    set(["pages"], [...doc.pages, page]);
    const nav = doc.settings.nav;
    if (toNav) set(["settings", "nav"], [...nav, { id: uniqueId(finalSlug, nav.map((n) => n.id)), label: page.title, link: `/${finalSlug}`, visible: true }]);
    setTitle("");
    setSlug(null);
    setMsg(`Page added at /${finalSlug}. Open it below to add sections.`);
  };

  return (
    <>
      <Field spec={{ k: "pages", label: "Pages", kind: "list", list: PAGES }} value={doc.pages} path={["pages"]} set={set} />
      <fieldset className="a-group">
        <legend>Add a page</legend>
        <div className="field">
          <label htmlFor="a-ptitle">Title</label>
          <input id="a-ptitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="a-pslug">
            Address <small>(the page will be at /{finalSlug || "…"})</small>
          </label>
          <input id="a-pslug" type="text" value={finalSlug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <label className="a-check">
          <input type="checkbox" checked={toNav} onChange={(e) => setToNav(e.target.checked)} /> Also add it to the menu
        </label>
        <button type="button" className="btn btn--small btn--primary" onClick={add}>
          Add page
        </button>
        <Status msg={msg} />
      </fieldset>
    </>
  );
}

export function ImagesTab() {
  const [items, setItems] = useState<Img[]>([]);
  const [msg, setMsg] = useState("");
  const load = () =>
    api<{ items: Img[] }>("images")
      .then((r) => setItems(r.items))
      .catch((e) => setMsg(errText(e)));
  useEffect(() => void load(), []);

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setMsg("Uploading…");
    try {
      await uploadImage(f);
      setMsg("Uploaded.");
      await load();
    } catch (err) {
      setMsg(errText(err));
    }
  }
  async function remove(img: Img) {
    if (!window.confirm("Delete this image? Any page that still uses it will show a broken image.")) return;
    try {
      await api(`images/${encodeURIComponent(img.id)}`, "DELETE");
      await load();
    } catch (err) {
      setMsg(errText(err));
    }
  }
  const copy = (url: string) =>
    navigator.clipboard
      .writeText(url)
      .then(() => setMsg(`Copied ${url}`))
      .catch(() => setMsg(`Copy failed. The address is ${url}`));

  return (
    <>
      <div className="field">
        <label htmlFor="a-upload">Upload an image (PNG, JPEG, WebP or GIF, up to 2 MB)</label>
        <input id="a-upload" type="file" accept={IMAGE_TYPES.join(",")} onChange={upload} />
      </div>
      <Status msg={msg} />
      {items.length === 0 && <p className="a-muted">No images uploaded yet.</p>}
      <ul className="a-grid">
        {items.map((img) => (
          <li key={img.id}>
            <img src={img.url} alt={`Uploaded image ${img.id}`} />
            <code>{img.url}</code>
            <small>
              {Math.ceil(img.size / 1024)} KB · {new Date(img.uploadedAt).toLocaleString()}
            </small>
            <span className="a-btns">
              <button type="button" className={btn} onClick={() => copy(img.url)}>
                Copy address
              </button>
              <button type="button" className={btn} onClick={() => remove(img)}>
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MessagesTab() {
  const [items, setItems] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");
  const load = () =>
    api<{ items: Message[] }>("messages")
      .then((r) => setItems([...r.items].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))))
      .catch((e) => setMsg(errText(e)));
  useEffect(() => void load(), []);

  async function remove(m: Message) {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    try {
      await api(`messages/${encodeURIComponent(m.id)}`, "DELETE");
      await load();
    } catch (err) {
      setMsg(errText(err));
    }
  }

  return (
    <>
      <Status msg={msg} />
      {items.length === 0 && <p className="a-muted">No messages yet. They appear here when someone uses the contact form.</p>}
      <ul className="a-cards">
        {items.map((m) => (
          <li key={m.id}>
            <div className="a-head">
              <strong>{m.name}</strong> <a href={`mailto:${m.email}`}>{m.email}</a>
              <small>{new Date(m.receivedAt).toLocaleString()}</small>
              <span className="a-btns">
                <button type="button" className={btn} onClick={() => remove(m)}>
                  Delete
                </button>
              </span>
            </div>
            <p className="a-pre">{m.message}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

type BackupProps = { saved: Content; dirty: boolean; onImport: (c: Content) => void; onReplace: (c: Content) => void };

export function BackupTab({ saved, dirty, onImport, onReplace }: BackupProps) {
  const [history, setHistory] = useState<{ version: number; updatedAt: string }[]>([]);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [reset, setReset] = useState("");
  useEffect(() => {
    api<{ items: { version: number; updatedAt: string }[] }>("content/history")
      .then((r) => setHistory(r.items))
      .catch((e) => setMsg(errText(e)));
  }, [saved.version]);

  const lose = dirty ? " Your unsaved changes will be lost." : "";
  const exportJson = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" }));
    a.download = `portfolio-content-v${saved.version}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  async function importJson(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    setErrors([]);
    if (!f) return;
    let data: unknown;
    try {
      data = JSON.parse(await f.text());
    } catch {
      return setMsg("This file is not valid JSON.");
    }
    const r = contentSchema.safeParse(data);
    if (!r.success) {
      setMsg("This file does not match the site content format:");
      return setErrors(r.error.issues.slice(0, 8).map((i) => `${pathText(data, i.path) || "file"}: ${i.message}`));
    }
    if (dirty && !window.confirm(`Load this file into the editor?${lose}`)) return;
    onImport(r.data);
    setMsg("File loaded into the editor. Check it, then press Save.");
  }
  async function run(question: string, path: string, body: object, done: string) {
    if (!window.confirm(question + lose)) return;
    try {
      onReplace((await api<Loaded>(path, "POST", body)).content);
      setMsg(done);
      setReset("");
    } catch (err) {
      setMsg(errText(err));
    }
  }

  return (
    <>
      <Status msg={msg} />
      {errors.length > 0 && (
        <ul className="a-errors">
          {errors.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
      <h2>Export</h2>
      <p>Download the last saved version (v{saved.version}) as a file.</p>
      <button type="button" className={btn} onClick={exportJson}>
        Download backup
      </button>
      <h2>Import</h2>
      <div className="field">
        <label htmlFor="a-import">Load a backup file (.json) into the editor. Nothing changes on the site until you press Save.</label>
        <input id="a-import" type="file" accept=".json,application/json" onChange={importJson} />
      </div>
      <h2>Version history</h2>
      {history.length === 0 && <p className="a-muted">No older versions yet.</p>}
      <ul className="a-cards">
        {history.map((h) => (
          <li key={h.version} className="a-head">
            <strong>v{h.version}</strong> <small>{h.updatedAt ? new Date(h.updatedAt).toLocaleString() : ""}</small>
            <span className="a-btns">
              <button
                type="button"
                className={btn}
                onClick={() => run(`Restore version ${h.version}? It goes live right away.`, "content/restore", { version: h.version }, `Version ${h.version} restored.`)}
              >
                Restore
              </button>
            </span>
          </li>
        ))}
      </ul>
      <h2>Reset to starting content</h2>
      <div className="field">
        <label htmlFor="a-reset">
          This replaces everything with the original example content. Type <strong>RESET</strong> to allow it.
        </label>
        <input id="a-reset" type="text" value={reset} onChange={(e) => setReset(e.target.value)} autoComplete="off" />
      </div>
      <button
        type="button"
        className={btn}
        disabled={reset !== "RESET"}
        onClick={() => run("Really reset all content? It goes live right away.", "content/reset", {}, "Content reset.")}
      >
        Reset content
      </button>
    </>
  );
}
