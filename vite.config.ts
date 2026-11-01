import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// CSP goes in the built index.html only: the dev server needs an inline script that a strict CSP would block.
// (frame-ancestors cannot be set by <meta>; netlify.toml sends X-Frame-Options: DENY instead.)
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; base-uri 'self'; form-action 'self'";

const cspMeta = (): Plugin => ({
  name: "csp-meta",
  apply: "build",
  transformIndexHtml: (html) => html.replace("<head>", `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`)
});

export default defineConfig({
  plugins: [react(), cspMeta()],
  server: {
    port: 5173
  },
  build: {
    outDir: "dist"
  }
});
