/**
 * Shared PDF generation for local dev API and production (Railway, etc.).
 */
import fs from 'node:fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { mdToPdf } = require('md-mermaid-pdf')

/**
 * Docker / Railway (and many PaaS images) run the Node process as root. Chromium
 * then exits unless we disable the sandbox — see https://pptr.dev/troubleshooting
 */
function headlessLaunchOptions() {
  const inDocker = fs.existsSync('/.dockerenv')
  const onRailway = Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_ENVIRONMENT_NAME ||
      process.env.RAILWAY_PROJECT_ID,
  )
  if (!inDocker && !onRailway) return {}

  return {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  }
}

/**
 * @param {Record<string, unknown>} json - Parsed POST body
 * @returns {Promise<Buffer | null>}
 */
export async function generatePdfBuffer(json) {
  const pdfOptions = {}
  if (json.pdf_format) pdfOptions.format = json.pdf_format
  if (json.margin) pdfOptions.margin = json.margin

  const result = await mdToPdf(
    { content: json.markdown },
    {
      dest: '',
      mermaidSource: 'bundled',
      mermaidConfig: json.mermaidConfig || {},
      documentTheme: json.documentTheme || 'light',
      pdf_options: pdfOptions,
      launch_options: headlessLaunchOptions(),
    },
  )
  return result?.content ?? null
}
