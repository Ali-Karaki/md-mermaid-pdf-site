import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import HomePage from '@/pages/HomePage'

const DocumentationPage = lazy(() => import('@/pages/DocumentationPage.jsx'))

function DocsFallback() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-sm text-muted-foreground">
      Loading documentation…
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-background text-foreground">
      <SiteNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/docs"
          element={
            <Suspense fallback={<DocsFallback />}>
              <DocumentationPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}
