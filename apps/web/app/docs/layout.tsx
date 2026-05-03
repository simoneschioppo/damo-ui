import type { ReactNode } from 'react'
import { DocsSidebar } from './_components/DocsSidebar'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen bg-background text-foreground">
      <div className="hidden lg:block">
        <DocsSidebar />
      </div>
      <main className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12 max-w-[920px] w-full">{children}</main>
    </div>
  )
}
