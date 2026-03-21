import { Link, NavLink } from 'react-router-dom'
import { BookOpen, Github, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NPM_URL, GITHUB_LIB_URL } from '@/lib/site-urls'

const navClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-foreground ${
    isActive ? 'text-foreground' : 'text-muted-foreground'
  }`

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 min-w-0 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:h-14 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0">
        <Link
          to="/"
          className="shrink-0 text-sm font-semibold tracking-tight hover:text-primary transition-colors"
        >
          md-mermaid-pdf
        </Link>
        <nav
          className="flex min-w-0 max-w-full flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:flex-nowrap sm:gap-4 lg:gap-6"
          aria-label="Main"
        >
          <NavLink to="/docs" className={navClass}>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-4 shrink-0" />
              <span className="hidden sm:inline">Documentation</span>
              <span className="inline sm:hidden">Docs</span>
            </span>
          </NavLink>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Package className="size-4" />
            npm
          </a>
          <a
            href={GITHUB_LIB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Github className="size-4" />
            GitHub
          </a>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/#demo">Try demo</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
