# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Documentation** route **`/docs`**: in-app reference for **md-mermaid-pdf** (CLI flags, programmatic exports, library-specific options, inherited **md-to-pdf** options link, front matter, batch/compose, Docker, GitHub Action, troubleshooting). **`react-router-dom`**, [`SiteNav`](src/components/SiteNav.jsx) / [`SiteFooter`](src/components/SiteFooter.jsx), [`DocumentationPage`](src/pages/DocumentationPage.jsx) (code-split with **`React.lazy`** + **`Suspense`**)
- **404:** unknown paths redirect to **`/`** via **`react-router-dom`** catch-all route
- **GitHub Actions → Railway:** [`.github/workflows/deploy-railway.yml`](.github/workflows/deploy-railway.yml) runs `railway up` on push to **`main`** using secret **`RAILWAY_TOKEN`** (project token); optional repo variables **`RAILWAY_SERVICE`**, **`RAILWAY_ENVIRONMENT`**. README documents native Railway GitHub deploy vs Actions to avoid duplicate deploys

### Changed

- **Docs a11y:** skip link to **`#docs-content`**, TOC **`nav`** uses **`aria-labelledby`** for “On this page”
- **Layout:** footer horizontal padding matches header (**`px-4 sm:px-6`**); **`overflow-x-hidden`** only on app shell (not **`body`**)

### Fixed

- **Railway / Docker PDF:** pass Chromium **`--no-sandbox`**, **`--disable-setuid-sandbox`**, **`--disable-dev-shm-usage`**, **`--disable-gpu`** via **`launch_options`** when running in Docker (`/.dockerenv`) or on Railway (`RAILWAY_*` env). Without this, Puppeteer fails as **root** with *Running as root without --no-sandbox is not supported* ([Puppeteer troubleshooting](https://pptr.dev/troubleshooting))

### Added

- **Railway** production path: [`Dockerfile`](Dockerfile) (Debian Chromium + `PUPPETEER_EXECUTABLE_PATH`; build runs **`npm ci`** without **`NODE_ENV=production`** so **Vite** is installed, then **`npm prune --omit=dev`**), [`railway.toml`](railway.toml), [`server/prod.mjs`](server/prod.mjs) serving **`dist/`** and **`POST /api/pdf`**, shared [`server/pdf-handler.mjs`](server/pdf-handler.mjs), **`npm start`**
- [`.cursor/mcp.json`](.cursor/mcp.json) — [Railway MCP server](https://docs.railway.com/reference/mcp-server) for Cursor (requires Railway CLI + `railway login`)

### Changed

- **Deploy target:** **Railway** (Docker) instead of **Vercel**; removed **`vercel.json`**, **`api/pdf.js`**, and **`@sparticuz/chromium`**
- **`md-mermaid-pdf`** → **`^0.1.4`** (preset resolve / `package.json` export; was `^0.1.2`)

### Removed

- Marketing “Before vs after” section and `public/before-code-block.svg` / `public/after-rendered.svg`

### Changed

- Demo layout: wider max width, larger column gaps, asymmetric grid (more space for Markdown + Preview, fixed-width settings sidebar), taller panes (`min(420px, 52vh)`), clearer panel chrome and intro copy
- Demo (desktop): **Markdown** and **Preview** are a single full-width column with a tab toggle; settings stay in the sidebar (no three narrow columns)
- **Download PDF** posts to `/api/pdf` and saves the file (no modal). Production: same route on **`server/prod.mjs`**. Local: `npm run dev:api` + `npm run dev` (proxy). `VITE_PDF_API` removed

### Removed

- Marketing **Use cases** section

### Fixed

- Vercel PDF API: pre-extract **`al2023.tar.br`** and call **`setupLambdaEnvironment('/tmp/al2023/lib')`** when `VERCEL=1` so Chromium finds **`libnss3.so`** (Sparticuz skips this outside Lambda)
- Vercel **`includeFiles`** for `api/pdf.js`: ship full **`md-mermaid-pdf`** tree, **`mermaid.min.js`**, **`highlight.js/styles`**, **`md-to-pdf/dist`** (fixes **`ENOENT`** on preset CSS and similar runtime loads). CI checks key files exist after **`npm ci`**. **`api/pdf`** logs **`BUNDLE_MISSING`** on Vercel if the preset file is still absent from the bundle
- Vercel **`vercel.json`**: `functions.*.includeFiles` must be a **single glob string** (use `{a,b}/**` brace expansion for multiple paths). A JSON **array** fails Vercel’s config validation, which broke every deployment after `includeFiles` was introduced

## [0.0.0] - 2026-03-21

### Added

- Initial extraction from [md-mermaid-pdf](https://github.com/Ali-Karaki/md-mermaid-pdf) (`apps/playground`) into this repository.
- Local PDF API (`npm run dev:api`) loads `md-mermaid-pdf` from npm instead of a monorepo path.
- [docs/website-prompt-exhaustive.md](docs/website-prompt-exhaustive.md) — UI/marketing spec (paths updated for this repo).
