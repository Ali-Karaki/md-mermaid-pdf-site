import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PDF_FORMATS = ['A4', 'Letter']
const MERMAID_THEMES = ['neutral', 'dark', 'default', 'forest', 'base']
const MARGIN_PRESETS = ['20mm', '15mm', '25mm']

export function SettingsPanel({
  markdown,
  pdfFormat,
  onPdfFormatChange,
  pageTheme,
  onPageThemeChange,
  mermaidTheme,
  onMermaidThemeChange,
  margin,
  onMarginChange,
}) {
  const [generating, setGenerating] = useState(false)
  const [exportError, setExportError] = useState(null)

  const downloadPdf = async () => {
    if (!markdown?.trim()) {
      setExportError('Add some markdown first.')
      return
    }
    setGenerating(true)
    setExportError(null)
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          mermaidConfig: { theme: mermaidTheme },
          documentTheme: pageTheme,
          pdf_format: pdfFormat,
          margin,
        }),
      })
      const ct = res.headers.get('content-type') || ''
      if (!res.ok) {
        const err = ct.includes('application/json')
          ? await res.json().catch(() => ({}))
          : {}
        throw new Error(err.error || `Request failed (${res.status})`)
      }
      if (!ct.includes('application/pdf')) {
        const text = await res.text()
        let msg = 'PDF service returned a non-PDF response.'
        try {
          const j = JSON.parse(text)
          if (j.error) msg = j.error
        } catch {
          /* ignore */
        }
        throw new Error(msg)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'document.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      const msg =
        e.message === 'Failed to fetch'
          ? 'Could not reach the PDF service. If you are running the app locally, start a second terminal with npm run dev:api (port 3001).'
          : e.message
      setExportError(msg)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs">PDF format</Label>
        <Select value={pdfFormat} onValueChange={onPdfFormatChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PDF_FORMATS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Page theme</Label>
        <Select value={pageTheme} onValueChange={onPageThemeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Mermaid theme</Label>
        <Select value={mermaidTheme} onValueChange={onMermaidThemeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MERMAID_THEMES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Margin</Label>
        <Select value={margin} onValueChange={onMarginChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MARGIN_PRESETS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 pt-1">
        <Button
          className="w-full"
          size="sm"
          onClick={downloadPdf}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileDown className="size-4" />
          )}
          {generating ? 'Generating PDF…' : 'Download PDF'}
        </Button>
        {exportError && (
          <p className="text-xs text-destructive leading-snug">{exportError}</p>
        )}
      </div>
    </div>
  )
}
