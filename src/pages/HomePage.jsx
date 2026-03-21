import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Code2, FileCode, Github, Globe, Package, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DemoSection } from '@/components/DemoSection'
import { MarketingSections } from '@/components/MarketingSections'
import { GITHUB_LIB_URL, NPM_URL } from '@/lib/site-urls'

const MotionSection = motion.section
const MotionLi = motion.li

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}

const trustBullets = [
  { text: 'No install needed for preview — try it in the browser', icon: Globe },
  { text: 'Mermaid diagrams rendered, not shown as code blocks', icon: FileCode },
  { text: 'PDF export runs locally with npx md-mermaid-pdf', icon: Terminal },
  { text: 'Built for developers — drop-in replacement for md-to-pdf', icon: Code2 },
]

export default function HomePage() {
  return (
    <>
      <a
        href="#demo"
        className="fixed left-4 top-20 z-[100] -translate-x-[200vw] rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-md outline-none ring-2 ring-ring transition-transform duration-200 focus:translate-x-0 focus:outline-none"
      >
        Skip to demo
      </a>
      <main className="flex-1 flex flex-col items-center px-6 py-16 md:py-24">
        <MotionSection
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            md-mermaid-pdf
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Markdown to PDF with Mermaid diagrams that actually render
          </p>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Not shown as plain code blocks — a drop-in fix for Mermaid in PDFs
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button size="lg" onClick={scrollToDemo}>
              Try it live
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/docs">
                <BookOpen className="size-4" />
                Documentation
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
                <Package className="size-4" />
                npm
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={GITHUB_LIB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
                GitHub
              </a>
            </Button>
          </div>
        </MotionSection>

        <MotionSection
          className="w-full max-w-4xl mt-16 md:mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border-border/60">
            <CardContent className="p-6 md:p-8">
              <ul className="grid gap-4 sm:grid-cols-2">
                {trustBullets.map((item, i) => {
                  const BulletIcon = item.icon
                  return (
                    <MotionLi
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <BulletIcon className="text-primary mt-0.5 shrink-0 size-4" />
                      <span>{item.text}</span>
                    </MotionLi>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </MotionSection>

        <div className="w-full px-6 flex flex-col items-center">
          <MarketingSections />
          <DemoSection />
        </div>
      </main>
    </>
  )
}
