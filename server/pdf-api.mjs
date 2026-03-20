#!/usr/bin/env node
/**
 * Optional local PDF API for the demo. POST /api/pdf with
 * { markdown, mermaidConfig?, documentTheme? } returns application/pdf.
 *
 * Uses the published `md-mermaid-pdf` package (Node + Chromium / Puppeteer).
 * Run with: npm run dev:api
 * With npm run dev, Vite proxies /api → this server (no env flag needed).
 */

import { createServer } from 'http'

import { generatePdfBuffer } from './pdf-handler.mjs'

const PORT = Number(process.env.PDF_API_PORT) || 3001

const server = createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/pdf') {
    res.writeHead(404)
    res.end()
    return
  }

  let body = ''
  for await (const chunk of req) body += chunk
  let json
  try {
    json = JSON.parse(body)
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid JSON' }))
    return
  }

  if (!json.markdown || typeof json.markdown !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'markdown required' }))
    return
  }

  try {
    const result = await generatePdfBuffer(json)
    if (!result) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'PDF generation failed' }))
      return
    }
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
    })
    res.end(result)
  } catch (err) {
    console.error('[pdf-api]', err.message)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message || 'PDF generation failed' }))
  }
})

server.listen(PORT, () => {
  console.log(`[pdf-api] Listening on http://localhost:${PORT}`)
})
