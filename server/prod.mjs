#!/usr/bin/env node
/**
 * Production: static `dist/` + POST /api/pdf (Railway, Docker, any Node host).
 * Set PORT (Railway provides it). Docker image sets PUPPETEER_EXECUTABLE_PATH for system Chromium.
 */

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generatePdfBuffer } from './pdf-handler.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '..', 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

const PORT = Number(process.env.PORT) || 3000

function safeJoin(base, requestPath) {
  const rel = path.normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '')
  const full = path.resolve(base, rel)
  const baseResolved = path.resolve(base)
  if (full !== baseResolved && !full.startsWith(baseResolved + path.sep)) return null
  return full
}

function sendStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  createReadStream(filePath).pipe(res)
}

function serveStatic(req, res) {
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  let pathname = decodeURIComponent(url.pathname)
  if (pathname === '/' || pathname === '') pathname = '/index.html'

  const rel = pathname.replace(/^\//, '')
  const filePath = safeJoin(DIST, rel)
  if (!filePath) {
    res.writeHead(403)
    res.end()
    return
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    sendStatic(req, res, filePath)
    return
  }

  const indexHtml = path.join(DIST, 'index.html')
  if (existsSync(indexHtml) && statSync(indexHtml).isFile()) {
    sendStatic(req, res, indexHtml)
    return
  }

  res.writeHead(404)
  res.end('Not found')
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/pdf') {
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
      const buf = await generatePdfBuffer(json)
      if (!buf) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'PDF generation failed' }))
        return
      }
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      })
      res.end(buf)
    } catch (err) {
      console.error('[prod]', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message || 'PDF generation failed' }))
    }
    return
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    serveStatic(req, res)
    return
  }

  res.writeHead(405)
  res.end()
})

server.listen(PORT, () => {
  console.log(`[prod] http://0.0.0.0:${PORT} (dist + /api/pdf)`)
})
