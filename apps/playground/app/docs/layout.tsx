import type { ReactNode } from 'react'
import { DocsSidebar } from './_components/DocsSidebar'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen bg-background text-foreground">
      <DocsSidebar />
      <main className="px-12 py-12 max-w-[920px] w-full">{children}</main>
    </div>
  )
}
