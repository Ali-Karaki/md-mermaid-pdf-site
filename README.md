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

Point **Vercel / Netlify** (or similar) at **this repository** with:

- **Root directory:** repository root (this folder after clone)
- **Build command:** `npm run build`
- **Output directory:** `dist`

## Optional: real PDF from the UI (local only)

Requires Node + Chromium (via `md-mermaid-pdf` → Puppeteer).

1. Terminal A: `npm run dev:api` (default port **3001**).
2. Terminal B: `VITE_PDF_API=1 npm run dev`

Set **`PDF_API_PORT`** if 3001 is in use.

Static hosting has **no** backend; the export dialog falls back to CLI instructions (`npx md-mermaid-pdf …`).

## CI note

`npm ci` requires **`md-mermaid-pdf` to be published** to npm at the version in `package.json`. For local work against an unpublished build, use `npm link md-mermaid-pdf` or a temporary `"md-mermaid-pdf": "file:../md-mermaid-pdf"` override.

## License

MIT (see [LICENSE](LICENSE)).
