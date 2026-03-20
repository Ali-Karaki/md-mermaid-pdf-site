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

/** Main editor/preview area — full width when toggling (desktop) */
const MAIN_PANE_MIN_H = 'min-h-[min(480px,58vh)]'

export function DemoSection() {
  const [md, setMd] = useState(EMPTY_MD)
  const [pdfFormat, setPdfFormat] = useState('A4')
  const [pageTheme, setPageTheme] = useState('dark')
  const [mermaidTheme, setMermaidTheme] = useState('neutral')
  const [margin, setMargin] = useState('20mm')
  /** Desktop: which single view is shown in the main column */
  const [deskMainTab, setDeskMainTab] = useState('markdown')

  const previewShell = (mobile) =>
    pageTheme === 'light'
      ? cn(
          'w-full rounded-lg border border-border/60 bg-white text-black overflow-auto',
          mobile ? 'min-h-[250px]' : cn('flex-1', MAIN_PANE_MIN_H),
        )
      : cn(
          'w-full rounded-lg border border-border/60 bg-muted/20 overflow-auto',
          mobile ? 'min-h-[250px]' : cn('flex-1', MAIN_PANE_MIN_H),
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
            Switch between Markdown and Preview for a full-width view — settings stay on the side (on
            large screens).
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

      {/* Desktop: main column toggles Markdown | Preview; settings sidebar */}
      <div
        className={cn(
          'hidden lg:grid gap-8 xl:gap-10 items-stretch',
          'lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)]',
        )}
      >
        <div
          className={cn(
            'flex flex-col rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden min-h-0',
            MAIN_PANE_MIN_H,
          )}
        >
          <Tabs
            value={deskMainTab}
            onValueChange={setDeskMainTab}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="shrink-0 border-b border-border/50 bg-muted/20 px-4 py-3">
              <TabsList
                className="grid w-full max-w-md grid-cols-2 h-auto p-1 gap-0.5"
                aria-label="Markdown or preview"
              >
                <TabsTrigger value="markdown" className="px-4 py-2">
                  Markdown
                </TabsTrigger>
                <TabsTrigger value="preview" className="px-4 py-2">
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="markdown"
              className="flex-1 flex flex-col min-h-0 mt-0 px-4 pb-4 pt-4 focus-visible:outline-none data-[state=inactive]:hidden"
            >
              <Textarea
                value={md}
                onChange={(e) => setMd(e.target.value)}
                placeholder="Paste Markdown with ```mermaid blocks…"
                className={cn(
                  'flex-1 w-full min-h-[min(400px,50vh)] font-mono text-sm resize-y border-border/60',
                )}
                spellCheck={false}
              />
            </TabsContent>
            <TabsContent
              value="preview"
              className="flex-1 flex flex-col min-h-0 mt-0 p-4 focus-visible:outline-none data-[state=inactive]:hidden"
            >
              <div className={cn(previewShell(false), 'flex flex-col min-h-[min(400px,50vh)]')}>
                <MermaidPreview markdown={md} theme={mermaidTheme} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="flex flex-col rounded-xl border border-border/60 bg-muted/10 shadow-sm overflow-hidden min-h-0">
          <div className="shrink-0 border-b border-border/50 bg-muted/20 px-4 py-3">
            <h3 className="text-sm font-medium tracking-tight">Settings</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              PDF and diagram options
            </p>
          </div>
          <div className="flex-1 p-5 overflow-y-auto min-h-0">
            <SettingsPanel {...settingsProps} />
          </div>
        </aside>
      </div>

      {/* Mobile / small tablet: Markdown | Preview | Settings */}
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
