/**
 * Vercel serverless: POST /api/pdf
 * Body: { markdown, mermaidConfig?, documentTheme?, pdf_format?, margin? }
 * Response: application/pdf (binary)
 *
 * Vercel is not detected as AWS Lambda by @sparticuz/chromium, so it skips
 * extracting al2023.tar.br (libnss3, etc.). We pre-extract and set LD_LIBRARY_PATH.
 */

import { createRequire } from 'module'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const Chromium = require('@sparticuz/chromium')
const { mdToPdf } = require('md-mermaid-pdf')
const lambdafs = require('@sparticuz/chromium/build/lambdafs.js').default
const { setupLambdaEnvironment } = require('@sparticuz/chromium/build/helper.js')

const AL2023_LIB = '/tmp/al2023/lib'

async function prepareChromiumForVercel() {
  if (process.env.VERCEL !== '1') return
  const chromiumRoot = path.dirname(require.resolve('@sparticuz/chromium/package.json'))
  const al2023Pack = path.join(chromiumRoot, 'bin', 'al2023.tar.br')
  await lambdafs.inflate(al2023Pack)
  setupLambdaEnvironment(AL2023_LIB)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'POST')
    res.end('Method Not Allowed')
    return
  }

  let body = ''
  for await (const chunk of req) {
    body += chunk
  }

  let json
  try {
    json = JSON.parse(body || '{}')
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Invalid JSON' }))
    return
  }

  if (!json.markdown || typeof json.markdown !== 'string') {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'markdown required' }))
    return
  }

  try {
    await prepareChromiumForVercel()
    if (process.env.VERCEL === '1') {
      const probe = path.join(process.cwd(), 'node_modules/md-mermaid-pdf/presets/document-dark.css')
      if (!fs.existsSync(probe)) {
        console.error('[api/pdf] BUNDLE_MISSING expected preset at', probe)
      }
    }
    const executablePath = await Chromium.executablePath()
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
        launch_options: {
          args: Chromium.args,
          defaultViewport: Chromium.defaultViewport,
          executablePath,
          headless: Chromium.headless,
        },
      },
    )

    if (!result?.content) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'PDF generation failed' }))
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"')
    res.end(result.content)
  } catch (err) {
    console.error('[api/pdf]', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err.message || 'PDF generation failed' }))
  }
}
