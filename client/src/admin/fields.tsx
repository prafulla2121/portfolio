// Generic, data-driven form pieces. A Spec says what a field is; Field / Fields / ItemList render any part of
// the content document from those specs, and write back through set(path, value).
import { useRef, useState } from "react";
import { api, errText, IMAGE_TYPES, uploadImage, type Img } from "./api";

export type Path = (string | number)[];
export type SetFn = (path: Path, value: unknown) => void;
type Kind = "text" | "long" | "lines" | "check" | "select" | "number" | "link" | "image" | "color" | "list";
export type Spec = { k: string; label: string; kind?: Kind; options?: readonly string[]; hint?: string; list?: ListSpec };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- items are many different shapes; zod checks them on save
type Item = any;
export type AddOption = { label: string; title: string; make: (id: string) => unknown };
export type ListSpec = {
  noun: string;
  fields?: (item: Item) => Spec[]; // leave out for a list of plain strings (paragraphs)
  add: AddOption[];
  sub?: (item: Item) => string; // small tag next to the item name
  canRemove?: (item: Item) => boolean;
};

// Immutable update: copies only the objects along the path.
export function setIn<T>(o: T, path: Path, v: unknown): T {
  if (!path.length) return v as T;
  const [k, ...rest] = path;
  const copy: Item = Array.isArray(o) ? [...o] : { ...(o as object) };
  copy[k] = setIn(copy[k], rest, v);
  return copy;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);

export function uniqueId(base: string, taken: unknown[]) {
  const b = base || "item";
  let id = b;
  for (let n = 2; taken.includes(id); n++) id = `${b}-${n}`;
  return id;
}

// "pages › Home › sections › About › title" instead of ["pages", 0, "sections", 1, "title"].
export function pathText(doc: unknown, path: PropertyKey[]) {
  let cur: Item = doc;
  return path
    .map((seg) => {
      cur = cur?.[seg as string];
      if (typeof seg !== "number") return String(seg);
      const name = cur?.title || cur?.label;
      return name ? `"${String(name)}"` : `#${seg + 1}`;
    })
    .join(" › ");
}

const safeImg = (v: unknown) => typeof v === "string" && /^(\/[^/]|https:\/\/)/i.test(v);
const LINK_HINT = "/page, #id, https://… or mailto:";

function Lines({ id, value, on }: { id: string; value: unknown; on: (v: string[]) => void }) {
  // Keep the raw text locally so a new empty line can be typed; save the cleaned list.
  const [text, setText] = useState(Array.isArray(value) ? value.join("\n") : "");
  return (
    <textarea
      id={id}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        on(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
    />
  );
}

function ImageInput({ id, value, on }: { id: string; value: string; on: (v: string) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [pics, setPics] = useState<Img[] | null>(null);
  const run = async (job: () => Promise<void>) => {
    setMsg("Working…");
    try {
      await job();
      setMsg("");
    } catch (e) {
      setMsg(errText(e));
    }
  };
  return (
    <>
      <input id={id} type="text" value={value} onChange={(e) => on(e.target.value)} />
      <div className="a-btns">
        <button type="button" className="btn btn--small btn--stroke" onClick={() => file.current?.click()}>
          Upload
        </button>
        <button
          type="button"
          className="btn btn--small btn--stroke"
          onClick={() => run(async () => setPics((await api<{ items: Img[] }>("images")).items))}
        >
          Pick from uploaded
        </button>
      </div>
      <input
        ref={file}
        type="file"
        hidden
        accept={IMAGE_TYPES.join(",")}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void run(async () => on((await uploadImage(f)).url));
        }}
      />
      {pics && (
        <div className="a-picks">
          {pics.length === 0 && <p>No uploaded images yet.</p>}
          {pics.map((p) => (
            <button key={p.id} type="button" onClick={() => (on(p.url), setPics(null))}>
              <img src={p.url} alt={`Use uploaded image ${p.id}`} />
            </button>
          ))}
        </div>
      )}
      {safeImg(value) && <img className="a-thumb" src={value} alt="Preview" />}
      {msg && <p role="status">{msg}</p>}
    </>
  );
}

export function Field({ spec, value, path, set }: { spec: Spec; value: unknown; path: Path; set: SetFn }) {
  const id = `f-${path.join("-")}`;
  const on = (v: unknown) => set(path, v);
  const kind = spec.kind ?? "text";
  const str = typeof value === "string" ? value : "";

  if (kind === "check")
    return (
      <label className="a-check">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => on(e.target.checked)} /> {spec.label}
      </label>
    );
  if (kind === "list" && spec.list)
    return (
      <fieldset className="a-group">
        <legend>{spec.label}</legend>
        <ItemList spec={spec.list} items={Array.isArray(value) ? value : []} path={path} set={set} />
      </fieldset>
    );

  let input;
  if (kind === "long") input = <textarea id={id} value={str} onChange={(e) => on(e.target.value)} />;
  else if (kind === "lines") input = <Lines id={id} value={value} on={on} />;
  else if (kind === "image") input = <ImageInput id={id} value={str} on={on} />;
  else if (kind === "select")
    input = (
      <select id={id} value={str} onChange={(e) => on(e.target.value)}>
        {spec.options?.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  else if (kind === "number")
    input = <input id={id} type="number" min={0} value={Number(value) || 0} onChange={(e) => on(e.target.valueAsNumber || 0)} />;
  else if (kind === "color")
    input = (
      <div className="a-color">
        <input type="color" aria-label={`${spec.label} picker`} value={/^#[0-9a-f]{6}$/i.test(str) ? str : "#000000"} onChange={(e) => on(e.target.value)} />
        <input id={id} type="text" value={str} onChange={(e) => on(e.target.value)} />
      </div>
    );
  else input = <input id={id} type="text" value={str} onChange={(e) => on(e.target.value)} />;

  const hint = spec.hint ?? (kind === "link" ? LINK_HINT : kind === "lines" ? "one per line" : "");
  return (
    <div className="field">
      <label htmlFor={id}>
        {spec.label} {hint && <small>({hint})</small>}
      </label>
      {input}
    </div>
  );
}

export function Fields({ specs, value, path, set }: { specs: Spec[]; value: Item; path: Path; set: SetFn }) {
  return (
    <>
      {specs.map((s) => (
        <Field key={s.k} spec={s} value={value?.[s.k]} path={[...path, s.k]} set={set} />
      ))}
    </>
  );
}

export function ItemList({ spec, items, path, set }: { spec: ListSpec; items: Item[]; path: Path; set: SetFn }) {
  const [pick, setPick] = useState(0);
  const move = (i: number, d: number) => {
    const a = [...items];
    [a[i], a[i + d]] = [a[i + d], a[i]];
    set(path, a);
  };
  const add = () => {
    const o = spec.add[pick];
    set(path, [...items, o.make(uniqueId(slugify(o.title), items.map((x) => x?.id)))]);
  };
  const btn = "btn btn--small btn--stroke";

  return (
    <div className="a-list">
      {items.length === 0 && <p className="a-muted">Nothing here yet.</p>}
      <ol>
        {items.map((it, i) => {
          const plain = typeof it === "string";
          const name = plain ? it.slice(0, 60) || "(empty)" : String(it.title || it.label || "(untitled)");
          return (
            <li key={plain ? i : it.id} className={it?.visible === false ? "is-off" : ""}>
              <div className="a-head">
                <strong>{name}</strong>
                {spec.sub && <span className="a-tag">{spec.sub(it)}</span>}
                {it?.visible === false && <span className="a-tag">hidden</span>}
                <span className="a-btns">
                  <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${name} up`}>
                    ↑
                  </button>
                  <button type="button" className={btn} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${name} down`}>
                    ↓
                  </button>
                  {!plain && "visible" in it && (
                    <button type="button" className={btn} onClick={() => set([...path, i, "visible"], !it.visible)}>
                      {it.visible ? "Hide" : "Show"}
                    </button>
                  )}
                  {(spec.canRemove?.(it) ?? true) && (
                    <button
                      type="button"
                      className={btn}
                      onClick={() => window.confirm(`Remove ${spec.noun} "${name}"?`) && set(path, items.filter((_, j) => j !== i))}
                    >
                      Remove
                    </button>
                  )}
                </span>
              </div>
              <details>
                <summary aria-label={`Edit ${name}`}>Edit</summary>
                <div className="a-body">
                  {plain ? (
                    <Field spec={{ k: String(i), label: "Text", kind: "long" }} value={it} path={[...path, i]} set={set} />
                  ) : (
                    <Fields specs={spec.fields?.(it) ?? []} value={it} path={[...path, i]} set={set} />
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
      {spec.add.length > 0 && (
        <div className="a-btns">
          {spec.add.length > 1 && (
            <select aria-label={`Type of new ${spec.noun}`} value={pick} onChange={(e) => setPick(Number(e.target.value))}>
              {spec.add.map((o, i) => (
                <option key={o.label} value={i}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          <button type="button" className="btn btn--small btn--primary" onClick={add}>
            Add {spec.noun}
          </button>
        </div>
      )}
    </div>
  );
}
