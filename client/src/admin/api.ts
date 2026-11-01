import type { Content } from "../../../shared/content";

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly fields: string[] = []) {
    super(message);
  }
}

// One helper for every admin call. JSON body by default; a File/Blob is sent raw with its own type (image upload).
export async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const raw = body instanceof Blob;
  const res = await fetch(`/api/admin/${path}`, {
    method,
    credentials: "same-origin",
    headers: method === "GET" ? {} : { "content-type": raw ? (body as Blob).type : "application/json" },
    body: method === "GET" ? undefined : raw ? (body as Blob) : JSON.stringify(body ?? {})
  });
  const out = (await res.json().catch(() => ({}))) as { error?: string; fields?: string[] };
  if (!res.ok) throw new ApiError(out.error ?? `Error ${res.status}`, res.status, out.fields ?? []);
  return out as T;
}

export const errText = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE = 2 * 1024 * 1024;

export function uploadImage(f: File) {
  if (!IMAGE_TYPES.includes(f.type)) return Promise.reject(new Error("Use a PNG, JPEG, WebP or GIF image."));
  if (f.size > MAX_IMAGE) return Promise.reject(new Error("This image is bigger than 2 MB. Make it smaller first."));
  return api<{ id: string; url: string }>("images", "POST", f);
}

export type Img = { id: string; url: string; type: string; size: number; uploadedAt: string };
export type Message = { id: string; name: string; email: string; message: string; receivedAt: string };
export type Loaded = { content: Content };
