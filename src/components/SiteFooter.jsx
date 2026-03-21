import { Github, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NPM_URL, GITHUB_LIB_URL } from '@/lib/site-urls'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-6 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>MIT · Open source</span>
        <div className="flex flex-wrap gap-6 justify-center">
          <Link to="/docs" className="hover:text-foreground transition-colors">
            Documentation
          </Link>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Package className="size-4" />
            npm
          </a>
          <a
            href={GITHUB_LIB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Github className="size-4" />
            GitHub
          </a>
          <a
            href={`${GITHUB_LIB_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Issues
          </a>
          <a
            href={`${GITHUB_LIB_URL}/blob/main/CHANGELOG.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Changelog
          </a>
          <a
            href={`${GITHUB_LIB_URL}/blob/main/docs/recipes.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Recipes
          </a>
        </div>
      </div>
    </footer>
  )
}
