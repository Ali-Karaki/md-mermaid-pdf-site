# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Railway** production path: [`Dockerfile`](Dockerfile) (Debian Chromium + `PUPPETEER_EXECUTABLE_PATH`; build runs **`npm ci`** without **`NODE_ENV=production`** so **Vite** is installed, then **`npm prune --omit=dev`**), [`railway.toml`](railway.toml), [`server/prod.mjs`](server/prod.mjs) serving **`dist/`** and **`POST /api/pdf`**, shared [`server/pdf-handler.mjs`](server/pdf-handler.mjs), **`npm start`**
- [`.cursor/mcp.json`](.cursor/mcp.json) — [Railway MCP server](https://docs.railway.com/reference/mcp-server) for Cursor (requires Railway CLI + `railway login`)

### Changed

- **Deploy target:** **Railway** (Docker) instead of **Vercel**; removed **`vercel.json`**, **`api/pdf.js`**, and **`@sparticuz/chromium`**
- `md-mermaid-pdf` → `^0.1.2` (npm readme / homepage metadata release)

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
