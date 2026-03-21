import { Link } from 'react-router-dom'
import {
  GITHUB_LIB_URL,
  MD_TO_PDF_OPTIONS,
  NPM_URL,
} from '@/lib/site-urls'

function CodeBlock({ children, title }) {
  return (
    <figure className="my-4 min-w-0 max-w-full">
      {title ? (
        <figcaption className="text-xs text-muted-foreground mb-2">{title}</figcaption>
      ) : null}
      <pre className="min-w-0 max-w-full rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed overflow-x-auto">
        <code className="block min-w-0 whitespace-pre text-[0.8125rem]">{children}</code>
      </pre>
    </figure>
  )
}

function H2({ id, children }) {
  return (
    <h2
      id={id}
      className="text-2xl font-semibold tracking-tight mt-14 mb-4 scroll-mt-24 first:mt-0"
    >
      {children}
    </h2>
  )
}

function H3({ id, children }) {
  return (
    <h3 id={id} className="text-lg font-medium mt-8 mb-3 scroll-mt-24">
      {children}
    </h3>
  )
}

function P({ children }) {
  return (
    <p className="min-w-0 max-w-full break-words text-sm leading-relaxed text-muted-foreground mb-4 [overflow-wrap:anywhere]">
      {children}
    </p>
  )
}

function Table({ headers, rows }) {
  return (
    <div className="my-4 min-w-0 max-w-full overflow-x-auto rounded-lg border border-border/60 overscroll-x-contain">
      <table className="w-full max-w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0">
              {cells.map((c, j) => (
                <td
                  key={j}
                  className="px-3 py-2 text-muted-foreground align-top break-words [overflow-wrap:anywhere]"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'install', label: 'Install' },
  { id: 'cli', label: 'CLI' },
  { id: 'api', label: 'Programmatic API' },
  { id: 'options', label: 'Library options' },
  { id: 'md-to-pdf', label: 'md-to-pdf options' },
  { id: 'front-matter', label: 'Front matter' },
  { id: 'batch-compose', label: 'Batch & compose' },
  { id: 'docker-action', label: 'Docker & CI' },
  { id: 'more', label: 'More docs' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

export default function DocumentationPage() {
  return (
    <div className="flex w-full min-w-0 max-w-6xl flex-col gap-10 mx-auto box-border px-4 py-10 sm:px-6 lg:flex-row lg:py-14">
      <a
        href="#docs-content"
        className="fixed left-4 top-20 z-[100] -translate-x-[200vw] rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-md outline-none ring-2 ring-ring transition-transform duration-200 focus:translate-x-0 focus:outline-none"
      >
        Skip to content
      </a>
      <aside className="min-w-0 w-full shrink-0 lg:w-52 lg:max-w-[13rem]">
        <p
          id="docs-toc-heading"
          className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          On this page
        </p>
        <nav
          className="flex w-full flex-wrap gap-x-2 gap-y-1 lg:flex-col lg:flex-nowrap lg:gap-1"
          aria-labelledby="docs-toc-heading"
        >
          {toc.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <article id="docs-content" className="min-w-0 w-full max-w-3xl flex-1">
        <p className="text-xs text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Documentation</span>
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Library reference
        </h1>
        <P>
          Complete guide for{' '}
          <a href={NPM_URL} className="text-primary hover:underline" target="_blank" rel="noreferrer">
            md-mermaid-pdf
          </a>
          — CLI, Node API, configuration, and links to deeper docs on GitHub.
        </P>

        <H2 id="overview">Overview</H2>
        <P>
          <strong className="text-foreground">md-mermaid-pdf</strong> is a drop-in alternative to{' '}
          <a
            href="https://github.com/simonhaenisch/md-to-pdf"
            className="text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            md-to-pdf
          </a>
          : fenced <code className="text-foreground">```mermaid</code> blocks are rendered with
          Mermaid before Puppeteer prints the PDF. You keep the same config surface as md-to-pdf,
          plus extra options for Mermaid source, themes, slides, and more.
        </P>

        <H2 id="install">Install & requirements</H2>
        <P>Requires Node ≥ 20.16 and npm ≥ 10.8 (see package <code>engines</code>).</P>
        <CodeBlock>{`npm install md-mermaid-pdf`}</CodeBlock>
        <P>
          The package is <strong className="text-foreground">CommonJS</strong> (
          <code>require(&apos;md-mermaid-pdf&apos;)</code>). In ESM, use{' '}
          <code>createRequire</code> or a bundler.
        </P>
        <P>
          Default Mermaid load uses the <strong className="text-foreground">CDN</strong> unless you
          set <code>mermaidSource: &apos;bundled&apos;</code> or <code>&apos;auto&apos;</code> — so
          PDF generation usually needs network access unless you bundle Mermaid locally.
        </P>

        <H2 id="cli">Command-line interface</H2>
        <P>
          Shorthand: <code>npx mmdpdf</code> (same as <code>npx md-mermaid-pdf</code>).
        </P>
        <CodeBlock title="Usage">{`md-mermaid-pdf <input.md> [output.pdf] [options]
md-mermaid-pdf <input1.md> [input2.md ...]
md-mermaid-pdf --concat a.md b.md -o book.pdf
md-mermaid-pdf "docs/**/*.md"
md-mermaid-pdf doc.md -o -   # PDF to stdout`}</CodeBlock>
        <P>
          If <code>output.pdf</code> is omitted, the PDF is written next to the markdown file.
          Glob patterns are expanded with fast-glob.
        </P>
        <H3 id="cli-flags">CLI flags</H3>
        <Table
          headers={['Flag', 'Description']}
          rows={[
            ['--watch', 'Rebuild when the file changes (single input only).'],
            ['--concat', 'Concatenate multiple files into one PDF; requires -o / --output.'],
            ['--slides', 'Slides preset: landscape, larger type, --- as slide breaks.'],
            ['--theme <name>', 'Mermaid theme (e.g. dark, neutral, default, forest).'],
            ['--document-theme <light|dark>', 'PDF page background preset.'],
            ['--mermaid-source, -m <x>', 'cdn | bundled | auto — how Mermaid is loaded.'],
            ['-o, --output <path>', 'Output path; use - for stdout.'],
            ['-h, --help', 'Show help.'],
          ]}
        />
        <P>
          In <code>CI=true</code>, the CLI adds Chromium flags{' '}
          <code>--no-sandbox</code> and <code>--disable-setuid-sandbox</code>.
        </P>

        <H2 id="api">Programmatic API</H2>
        <H3 id="exports">Exports</H3>
        <Table
          headers={['Export', 'Purpose']}
          rows={[
            [
              <code key="e1">mdToPdf</code>,
              'Main API: pass { path } or { content } plus config (default export).',
            ],
            [
              <code key="e2">mdToPdfAuto(path, partial?)</code>,
              'Zero-config: basedir, dest beside input, mermaidSource: auto.',
            ],
            [
              <code key="e3">{`mdToPdfFromFiles(paths, config, { separator })`}</code>,
              'Concatenate multiple .md files into one PDF.',
            ],
            [
              <code key="e4">mdToPdfBatch(paths, config, options)</code>,
              'Many files → many PDFs; optional concurrency and incremental cache.',
            ],
            [
              <code key="e5">DEFAULT_MERMAID_CDN_URL</code>,
              'Default jsDelivr URL for Mermaid (pinned major).',
            ],
            [
              <code key="e6">createMermaidMarkedRenderer</code>,
              'Marked renderer for mermaid fences only (advanced).',
            ],
            [
              <code key="e7">convertMdToPdfMermaid</code>,
              'Lower level: expects merged config + browser.',
            ],
            [
              <code key="e8">generateOutputMermaid</code>,
              'Lowest level HTML → PDF step with Mermaid wait.',
            ],
          ]}
        />
        <H3 id="minimal-examples">Minimal examples</H3>
        <CodeBlock title="From file">{`const { mdToPdf } = require('md-mermaid-pdf');

await mdToPdf(
  { path: 'doc.md' },
  { dest: 'doc.pdf', basedir: __dirname },
);`}</CodeBlock>
        <CodeBlock title="From string">{`await mdToPdf(
  { content: markdownString },
  { dest: '', mermaidSource: 'bundled' },
);  // returns { content: Buffer }`}</CodeBlock>
        <CodeBlock title="Auto output path">{`const { mdToPdfAuto } = require('md-mermaid-pdf');
await mdToPdfAuto('slides.md');  // writes slides.pdf`}</CodeBlock>

        <H2 id="options">md-mermaid-pdf-specific options</H2>
        <P>Pass these on the config object alongside md-to-pdf options.</P>
        <Table
          headers={['Option', 'Type / values', 'Description']}
          rows={[
            [
              <code key="o1">mermaidSource</code>,
              "'cdn' | 'bundled' | 'auto'",
              'How to load Mermaid. auto preflights CDN and can fall back to bundled.',
            ],
            [
              <code key="o2">mermaidCdnUrl</code>,
              'string',
              'Override default CDN URL (default exported as DEFAULT_MERMAID_CDN_URL).',
            ],
            [
              <code key="o3">mermaidConfig</code>,
              'object',
              'Mermaid init config (theme, flowchart, etc.).',
            ],
            [
              <code key="o4">documentTheme</code>,
              "'light' | 'dark'",
              'Preset body styles for light or dark PDF pages.',
            ],
            [
              <code key="o5">preset</code>,
              "'github' | 'minimal' | 'slides'",
              'CSS presets; slides = landscape + --- page breaks.',
            ],
            [
              <code key="o6">mermaidExportImages</code>,
              'string | { dir, format }',
              'Save each diagram as PNG (default) or SVG under a directory.',
            ],
            [
              <code key="o7">failOnMermaidError</code>,
              'boolean',
              'Throw if Mermaid fails to parse a diagram.',
            ],
            [
              <code key="o8">onMermaidError</code>,
              '(err, { diagramCount }) => "skip" | "throw"',
              'Custom handling instead of failOnMermaidError.',
            ],
            [
              <code key="o9">mermaidWaitUntil</code>,
              "Puppeteer waitUntil",
              'When to consider Mermaid done (e.g. networkidle0).',
            ],
            [
              <code key="o10">mermaidRenderTimeoutMs</code>,
              'number',
              'Timeout for Mermaid render.',
            ],
            [
              <code key="o11">mermaidAutofix</code>,
              'boolean',
              'Light regex fixes on diagram text (e.g. trim whitespace).',
            ],
            [
              <code key="o12">toc</code>,
              'boolean',
              'Prepend a heading-based table of contents.',
            ],
            [
              <code key="o13">outputCache</code>,
              'boolean | { dir }',
              'Hash-based skip when input unchanged and output exists.',
            ],
            [
              <code key="o14">hashOutput</code>,
              'boolean',
              'Write .sha256 sidecar next to PDF.',
            ],
            [
              <code key="o15">beforeRender(page)</code>,
              'async fn',
              'Puppeteer hook: e.g. addStyleTag before print.',
            ],
            [
              <code key="o16">debug</code>,
              'boolean',
              'Write .md-mermaid-pdf-debug.html and log Mermaid errors.',
            ],
          ]}
        />

        <H2 id="md-to-pdf">Inherited md-to-pdf options</H2>
        <P>
          Everything md-to-pdf supports still applies:{' '}
          <code>pdf_options</code> (format, margin, printBackground, …),{' '}
          <code>launch_options</code> (Puppeteer/Chromium args, executablePath),{' '}
          <code>stylesheet</code>, <code>marked_options</code>, <code>port</code>,{' '}
          <code>basedir</code>, <code>dest</code>, <code>devtools</code>, and more.
        </P>
        <P>
          <a href={MD_TO_PDF_OPTIONS} className="text-primary hover:underline" target="_blank" rel="noreferrer">
            md-to-pdf options reference →
          </a>
        </P>

        <H2 id="front-matter">YAML front matter</H2>
        <P>
          Top-of-file YAML is merged into config. Use keys like <code>mermaidConfig</code>,{' '}
          <code>preset</code>, <code>toc</code>, <code>documentTheme</code>,{' '}
          <code>pdf_options</code>, etc.
        </P>
        <CodeBlock>{`---
preset: github
toc: true
documentTheme: dark
mermaidConfig:
  theme: forest
pdf_options:
  format: A4
  margin: 20mm
---`}</CodeBlock>
        <P>
          To avoid collisions with other front matter (e.g. CMS fields), nest under{' '}
          <code>md_mermaid_pdf:</code>.
        </P>
        <CodeBlock>{`---
title: My doc
md_mermaid_pdf:
  preset: slides
  toc: true
---`}</CodeBlock>

        <H2 id="batch-compose">Batch & multi-file compose</H2>
        <H3 id="compose">mdToPdfFromFiles / --concat</H3>
        <P>
          Only the <strong className="text-foreground">first file’s</strong> front matter applies;
          later files are concatenated as markdown. Optional <code>separator</code> (default newline +
          rule).
        </P>
        <CodeBlock>{`const { mdToPdfFromFiles } = require('md-mermaid-pdf');

await mdToPdfFromFiles(
  ['intro.md', 'chapter1.md'],
  { dest: 'book.pdf', basedir: __dirname },
  { separator: '\\n\\n---\\n\\n' },
);`}</CodeBlock>
        <CodeBlock title="CLI">{`npx md-mermaid-pdf --concat intro.md chapter1.md -o book.pdf`}</CodeBlock>
        <H3 id="batch">mdToPdfBatch</H3>
        <P>
          Converts many paths to many PDFs (one per input). Options:{' '}
          <code>concurrency</code>, <code>incremental</code>, <code>cacheDir</code> (hash cache for
          skips).
        </P>
        <CodeBlock>{`const { mdToPdfBatch } = require('md-mermaid-pdf');

await mdToPdfBatch(['a.md', 'b.md'], { basedir: __dirname }, {
  concurrency: 2,
  incremental: true,
  cacheDir: '.md-mermaid-pdf-cache',
});`}</CodeBlock>

        <H2 id="docker-action">Docker & GitHub Actions</H2>
        <H3 id="docker">Docker</H3>
        <P>Official Dockerfile in the library repo; mount your project at /work.</P>
        <CodeBlock>{`docker build -t md-mermaid-pdf .
docker run --rm -v "$(pwd):/work" -w /work md-mermaid-pdf input.md output.pdf`}</CodeBlock>
        <H3 id="gha">Composite GitHub Action</H3>
        <CodeBlock>{`- uses: actions/checkout@v4
- uses: Ali-Karaki/md-mermaid-pdf/action@main
  with:
    input: docs/readme.md
    output: readme.pdf`}</CodeBlock>

        <H2 id="more">Further reading (GitHub)</H2>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5 mb-6">
          <li>
            <a
              href={`${GITHUB_LIB_URL}/blob/main/docs/recipes.md`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Integration recipes
            </a>{' '}
            — Express, Next.js API routes, etc.
          </li>
          <li>
            <a
              href={`${GITHUB_LIB_URL}/blob/main/docs/compose.md`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Multi-file composition
            </a>
          </li>
          <li>
            <a
              href={`${GITHUB_LIB_URL}/blob/main/docs/determinism.md`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Determinism & batch incremental mode
            </a>
          </li>
          <li>
            <a
              href={`${GITHUB_LIB_URL}/blob/main/README.md`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Full README
            </a>{' '}
            — narrative docs and more examples
          </li>
          <li>
            <a
              href={`${GITHUB_LIB_URL}/blob/main/CHANGELOG.md`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Changelog
            </a>
          </li>
        </ul>

        <H2 id="troubleshooting">Troubleshooting</H2>
        <ul className="text-sm text-muted-foreground space-y-3 list-disc pl-5 mb-8">
          <li>
            <strong className="text-foreground">Offline / air-gapped:</strong> use{' '}
            <code>mermaidSource: &apos;bundled&apos;</code> or inject Mermaid via{' '}
            <code>script</code>.
          </li>
          <li>
            <strong className="text-foreground">Linux / Docker / root:</strong> Chromium may need{' '}
            <code>launch_options.args</code> including <code>--no-sandbox</code> and{' '}
            <code>--disable-setuid-sandbox</code> (
            <a href="https://pptr.dev/troubleshooting" className="text-primary hover:underline" target="_blank" rel="noreferrer">
              Puppeteer docs
            </a>
            ).
          </li>
          <li>
            <strong className="text-foreground">Flaky diagrams:</strong> tune{' '}
            <code>mermaidWaitUntil</code> or <code>mermaidRenderTimeoutMs</code>.
          </li>
          <li>
            <strong className="text-foreground">Debug HTML:</strong> <code>debug: true</code> writes{' '}
            <code>.md-mermaid-pdf-debug.html</code>.
          </li>
        </ul>

        <p className="text-sm text-muted-foreground border-t border-border/60 pt-8">
          This page summarizes the published API. For the exact behavior of an edge case, check the
          version you have installed and the{' '}
          <a href={GITHUB_LIB_URL} className="text-primary hover:underline" target="_blank" rel="noreferrer">
            source on GitHub
          </a>
          .
        </p>
      </article>
    </div>
  )
}
