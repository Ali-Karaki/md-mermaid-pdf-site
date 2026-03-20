/**
 * Shared PDF generation for local dev API and production (Railway, etc.).
 */
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { mdToPdf } = require('md-mermaid-pdf')

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
    },
  )
  return result?.content ?? null
}
