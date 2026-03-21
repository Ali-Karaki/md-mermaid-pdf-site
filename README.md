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

Open the URL Vite prints (e.g. `http://localhost:5173/`). **Documentation** (full library reference: CLI, API, options): [`/docs`](http://localhost:5173/docs).

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

### GitHub → Railway CI/CD

You can wire deploys in two ways (pick **one** per repo so you don’t double-build on every push):

| Approach | What to do |
|----------|------------|
| **Native Railway ↔ GitHub** | In Railway: connect this GitHub repo on the service (**Settings → Source** / deploy triggers). Pushes to the chosen branch deploy automatically. No Actions secret required. |
| **GitHub Actions** | Add a [project token](https://docs.railway.com/guides/cli#tokens): Railway **Project → Settings → Tokens** → create token. In GitHub: **Settings → Secrets and variables → Actions** → **New repository secret** → name **`RAILWAY_TOKEN`**, paste the token. The workflow [`.github/workflows/deploy-railway.yml`](.github/workflows/deploy-railway.yml) runs on every push to **`main`** (and **workflow_dispatch**). Optional **Variables**: **`RAILWAY_SERVICE`** (default `md-mermaid-pdf-site`), **`RAILWAY_ENVIRONMENT`** (default `production`). If you use this workflow, **turn off** Railway’s built-in GitHub auto-deploy for the same branch, or every push will trigger two deploys. |

`RAILWAY_TOKEN` must be a **project token** (not a personal API token) for `railway up` in CI — see [Railway CLI / Tokens](https://docs.railway.com/guides/cli#tokens).

**Chromium in Docker:** the app adds **`--no-sandbox`** (etc.) when it detects Docker or Railway, because the process often runs as **root** in containers and stock Chromium refuses that without those flags. This is normal for headless PDF on PaaS, not a sign Railway is “not a real server.”

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
