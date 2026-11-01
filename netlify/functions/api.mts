import { getStore } from "@netlify/blobs";
import { handle, type KV } from "../lib/api.ts";

export default (req: Request, context: { ip?: string }) =>
  handle(req, {
    store: (name) => getStore({ name, consistency: "strong" }) as unknown as KV,
    env: process.env,
    ip: context.ip ?? ""
  });

export const config = { path: "/api/*" };
