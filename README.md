# Prafulla Purohit, portfolio

Live: https://prafulla-purohit.netlify.app (placeholder: set the real site name in Netlify)

Personal site of Prafulla Purohit, Forward Deployed / Applied AI Engineer. The whole site is one
JSON content document that the owner edits in a built-in admin panel at `/admin`. No code changes
are needed to change text, projects, pages, navigation, images, colours, fonts or animations.

## Stack

- Vite + React 18 + TypeScript, react-router, `motion` for animation
- Netlify Functions (TypeScript) in `netlify/functions/api.mts`, logic in `netlify/lib/api.ts`
- Netlify Blobs for storage: the content document (with version history), uploaded images, contact messages, rate-limit counters
- `zod` schema in `shared/content.ts` validates every write; `shared/seed.ts` is the starting content

## How the admin works

- Open `/admin` and sign in with the admin password. The server checks it against the bcrypt hash in
  the env var `ADMIN_PASSWORD_HASH`. Login is rate-limited (5 tries per 15 minutes per IP).
- A session is an httpOnly, Secure, SameSite=Strict cookie signed with HMAC-SHA256 using `SESSION_SECRET` (8 hours).
- Every write must come from the site's own origin with a JSON (or image) body, so other sites cannot post on your behalf.
- What you can edit: site settings (title, meta, OG image, logo, name, email, footer), navigation (add, rename,
  reorder, hide), social links, theme colours and fonts (from an allowed list), the page loader and a global
  animations switch, every page and section (add, remove, reorder, hide, choose its animation), items inside sections
  (projects, roles, skill groups, list items), image uploads (PNG, JPEG, WebP, GIF, up to 2 MB, checked by file content),
  contact-form messages, and backups (export JSON, import JSON, version history with restore, reset to seed).
- In a hero title, type `|` where you want a line break.
- Each save is checked against the schema and gets a new version number; the last 20 versions are kept.
  If two tabs save at once, the second one is told to reload instead of overwriting.

## API

| Route | Who | What |
| --- | --- | --- |
| `GET /api/content` | public | the content document (seed if nothing saved yet) |
| `GET /api/images/:id` | public | an uploaded image |
| `POST /api/contact` | public | contact form (validated, honeypot, 3 per hour per IP) |
| `POST /api/admin/login`, `/logout`, `GET /api/admin/session` | admin | sign in and out |
| `GET`/`PUT /api/admin/content`, `POST .../reset`, `GET .../history`, `POST .../restore` | admin | edit the document |
| `GET`/`POST /api/admin/images`, `DELETE /api/admin/images/:id` | admin | image library |
| `GET /api/admin/messages`, `DELETE /api/admin/messages/:id` | admin | contact messages |

## Run locally

```bash
npm install
npm test                      # API tests (Node 22.12+)
npm run build                 # type check + production build
npm run hash-password -- "a long admin password"   # prints ADMIN_PASSWORD_HASH and a SESSION_SECRET
cp .env.example .env          # paste both values; keep the hash in single quotes
npx netlify-cli dev           # site + functions + local Blobs on http://localhost:8888
```

`npm run dev` (plain Vite) also works; it has no API, so it shows the seed content and the admin says it is not configured.

## Deploy on Netlify

1. Netlify, Add new site, Import from GitHub, pick `prafulla2121/portfolio`. Build settings come from `netlify.toml`
   (build `npm run build`, publish `dist`, functions `netlify/functions`, Node 22).
2. Site configuration, Environment variables: add `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` (from `npm run hash-password`).
   Mark both as secret.
3. Site configuration, Site details, Change site name: for example `prafulla-purohit` gives `https://prafulla-purohit.netlify.app`.
4. Deploy, then open `/admin`, sign in, and edit. Netlify Blobs needs no extra account or setup.

Never commit `.env` or real secrets.
