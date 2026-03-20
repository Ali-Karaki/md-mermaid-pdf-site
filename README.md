# md-mermaid-pdf-site

Marketing site and **live Markdown + Mermaid preview** for [**md-mermaid-pdf**](https://github.com/Ali-Karaki/md-mermaid-pdf) (Markdown → PDF with diagrams that render).

- **Live site:** [md-mermaid-pdf-site.vercel.app](https://md-mermaid-pdf-site.vercel.app/)
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

## Deploy

**Vercel (recommended):** connect the repo; use defaults or:

- **Root directory:** repository root
- **Build command:** `npm run build`
- **Output directory:** `dist`

`vercel.json` skips downloading Puppeteer’s bundled Chromium at install time; **Download PDF** uses the serverless route `api/pdf.js` (`@sparticuz/chromium` + `md-mermaid-pdf`). On Vercel, `api/pdf.js` extracts **`al2023.tar.br`** and sets **`LD_LIBRARY_PATH`** (Sparticuz only does this automatically on AWS Lambda; without it Chromium fails with missing **`libnss3.so`**). **`vercel.json`** lists **`includeFiles`** so Vercel’s Node bundler ships files that are loaded by **runtime paths** (not just static `import`s): the whole **`md-mermaid-pdf`** package, bundled **`mermaid.min.js`**, **`highlight.js`** styles, and **`md-to-pdf/dist`**. Without that, **`ENOENT`** on e.g. `document-dark.css` is expected. We can’t run a real Vercel deploy from CI; this repo’s workflow checks those paths exist after **`npm ci`** so a broken npm publish is caught early. If production still fails, open the function log and look for **`[api/pdf] BUNDLE_MISSING`** (means `includeFiles` still didn’t apply—check Vercel’s build output or glob paths). **Function timeout** is 60s — Hobby may cap lower.

**Netlify / pure static hosts:** there is no `/api/pdf` unless you add your own backend; use the CLI locally or deploy to Vercel for in-browser download.

## PDF from the UI (local dev)

Requires Node + Chromium (via `md-mermaid-pdf` → Puppeteer).

1. Terminal A: `npm run dev:api` (default port **3001**).
2. Terminal B: `npm run dev` — Vite proxies `/api` to the PDF server.

Set **`PDF_API_PORT`** if 3001 is in use.

## CI note

`npm ci` requires **`md-mermaid-pdf` to be published** to npm at the version in `package.json`. For local work against an unpublished build, use `npm link md-mermaid-pdf` or a temporary `"md-mermaid-pdf": "file:../md-mermaid-pdf"` override.

## License

MIT (see [LICENSE](LICENSE)).
