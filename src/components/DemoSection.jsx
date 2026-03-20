import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileDown, RotateCcw } from 'lucide-react'

const MotionSection = motion.section
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MermaidPreview } from '@/components/MermaidPreview'
import { SettingsPanel } from '@/components/SettingsPanel'
import { SAMPLE_MD, EMPTY_MD } from '@/demo/SAMPLE_MD'
import { cn } from '@/lib/utils'

const PANE_MIN_H = 'min-h-[min(420px,52vh)]'

function DemoPane({ title, children, className }) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden min-h-0',
        className,
      )}
    >
      <div className="shrink-0 border-b border-border/50 bg-muted/20 px-4 py-3">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      </div>
      <div className="flex-1 min-h-0 p-4 flex flex-col">{children}</div>
    </div>
  )
}

export function DemoSection() {
  const [md, setMd] = useState(EMPTY_MD)
  const [pdfFormat, setPdfFormat] = useState('A4')
  const [pageTheme, setPageTheme] = useState('dark')
  const [mermaidTheme, setMermaidTheme] = useState('neutral')
  const [margin, setMargin] = useState('20mm')

  const previewShell = (mobile) =>
    pageTheme === 'light'
      ? cn(
          'flex-1 rounded-lg border border-border/60 bg-white text-black overflow-auto',
          mobile ? 'min-h-[250px]' : PANE_MIN_H,
        )
      : cn(
          'flex-1 rounded-lg border border-border/60 bg-muted/20 overflow-auto',
          mobile ? 'min-h-[250px]' : PANE_MIN_H,
        )

  const settingsProps = {
    markdown: md,
    pdfFormat,
    onPdfFormatChange: setPdfFormat,
    pageTheme,
    onPageThemeChange: setPageTheme,
    mermaidTheme,
    onMermaidThemeChange: setMermaidTheme,
    margin,
    onMarginChange: setMargin,
  }

  return (
    <MotionSection
      id="demo"
      className="w-full max-w-7xl mx-auto mt-16 md:mt-28 px-1 sm:px-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Demo</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            Edit markdown, preview Mermaid in the browser, then export — settings apply to PDF output.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setMd(SAMPLE_MD)}>
            <FileDown className="size-4" />
            Load example
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMd(EMPTY_MD)}>
            <RotateCcw className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Desktop / large tablet: editor + preview get most width; settings sidebar */}
      <div
        className={cn(
          'hidden lg:grid gap-8 xl:gap-10 items-stretch',
          'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(260px,300px)]',
        )}
      >
        <DemoPane title="Markdown">
          <Textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            placeholder="Paste Markdown with ```mermaid blocks…"
            className={cn(
              'flex-1 w-full font-mono text-sm resize-y border-border/60',
              PANE_MIN_H,
            )}
            spellCheck={false}
          />
        </DemoPane>
        <DemoPane title="Preview">
          <div className={previewShell(false)}>
            <MermaidPreview markdown={md} theme={mermaidTheme} />
          </div>
        </DemoPane>
        <aside className="flex flex-col rounded-xl border border-border/60 bg-muted/10 shadow-sm overflow-hidden">
          <div className="shrink-0 border-b border-border/50 bg-muted/20 px-4 py-3">
            <h3 className="text-sm font-medium tracking-tight">Settings</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              PDF and diagram options
            </p>
          </div>
          <div className="flex-1 p-5 overflow-y-auto">
            <SettingsPanel {...settingsProps} />
          </div>
        </aside>
      </div>

      {/* Mobile / small tablet */}
      <div className="lg:hidden">
        <Tabs defaultValue="markdown" className="w-full gap-4">
          <TabsList className="grid w-full h-auto grid-cols-3 gap-1 p-1.5 bg-muted/30">
            <TabsTrigger value="markdown" className="py-2.5">
              Markdown
            </TabsTrigger>
            <TabsTrigger value="preview" className="py-2.5">
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-2.5">
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="markdown" className="mt-4">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <Textarea
                  value={md}
                  onChange={(e) => setMd(e.target.value)}
                  placeholder="Paste Markdown with ```mermaid blocks…"
                  className="min-h-[min(280px,45vh)] font-mono text-sm resize-y"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className={previewShell(true)}>
                  <MermaidPreview markdown={md} theme={mermaidTheme} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <SettingsPanel {...settingsProps} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MotionSection>
  )
}
