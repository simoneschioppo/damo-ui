import type { ReactNode } from 'react'
import { SidebarProvider } from '@axologic/ui'
import { DocsSidebar } from './_components/DocsSidebar'
import { DocsMobileBar } from './_components/DocsMobileBar'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen bg-background text-foreground">
        {/* Desktop: sticky sidebar in column 1. Mobile: renders the same nav
            inside a drawer (opened from <DocsMobileBar/>), so this is visually
            empty here. */}
        <DocsSidebar />
        <div className="min-w-0">
          <DocsMobileBar />
          <main className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12 max-w-[920px] w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
