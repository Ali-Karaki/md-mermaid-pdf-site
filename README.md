# md-mermaid-pdf-site

Marketing site and **live Markdown + Mermaid preview** for [**md-mermaid-pdf**](https://github.com/Ali-Karaki/md-mermaid-pdf) (Markdown → PDF with diagrams that render).

- **Live site:** deploy on [Railway](https://railway.app) (see **Deploy**); after you assign a public URL, update the **Live site** link here and **`og:url`** in [`index.html`](index.html) for correct social previews.
- **npm:** [md-mermaid-pdf](https://www.npmjs.com/package/md-mermaid-pdf)
- **Library repo:** [github.com/Ali-Karaki/md-mermaid-pdf](https://github.com/Ali-Karaki/md-mermaid-pdf)

This app implements the spec in [docs/website-prompt-exhaustive.md](docs/website-prompt-exhaustive.md).

## Run

```bash
npm ci
npm run dev
```

Open the URL Vite prints (e.g. `http://localhost:5173/`).

## Build & preview

```bash
npm run build
npm run preview
```

## Production (local smoke test)

After `npm run build`, the same server Railway runs:

```bash
npm start
# http://localhost:3000 — static `dist/` + POST /api/pdf
```

`PORT` overrides the listen port (Railway sets it automatically).

## Deploy

**Railway (recommended):** connect this repo, keep **root directory** at the repo root. The project includes [`Dockerfile`](Dockerfile) and [`railway.toml`](railway.toml) so Railway builds a **Docker** image: `npm ci` → `npm run build` → `node server/prod.mjs`. The image installs **system Chromium** and sets **`PUPPETEER_EXECUTABLE_PATH`** so **`md-mermaid-pdf`** / Puppeteer can render PDFs without Vercel-style serverless hacks.

1. [Railway Dashboard](https://railway.app) → **New Project** → **Deploy from GitHub** → select this repository.
2. After the first successful deploy: **Settings → Networking → Generate domain** (or attach your own).
3. Optional: increase **memory** if large Mermaid diagrams time out (PDF generation is Chromium-heavy).

**Cursor + Railway MCP:** add the [Railway MCP server](https://docs.railway.com/reference/mcp-server) (see [`.cursor/mcp.json`](.cursor/mcp.json) in this repo). Install and log in with the [Railway CLI](https://docs.railway.com/cli) first (`railway login`).

**Netlify / pure static hosts:** there is no `/api/pdf` unless you add your own backend; use the CLI locally, run **`npm start`** on a Node host, or deploy this repo to Railway for in-browser download.

## PDF from the UI (local dev)

Requires Node + Chromium (via `md-mermaid-pdf` → Puppeteer).

1. Terminal A: `npm run dev:api` (default port **3001**).
2. Terminal B: `npm run dev` — Vite proxies `/api` to the PDF server.

Set **`PDF_API_PORT`** if 3001 is in use.

## CI note

`npm ci` requires **`md-mermaid-pdf` to be published** to npm at the version in `package.json`. For local work against an unpublished build, use `npm link md-mermaid-pdf` or a temporary `"md-mermaid-pdf": "file:../md-mermaid-pdf"` override.

## License

MIT (see [LICENSE](LICENSE)).
