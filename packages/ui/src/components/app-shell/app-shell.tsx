'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode
  sidebarWidth?: number
  sidebarTone?: 'default' | 'onDark'
}

/**
 * AppShell — two-column layout with sticky sidebar + main. Configurable sidebar width and tone.
 *
 * @example
 * ```tsx
 * <AppShell sidebar={<Nav />} sidebarWidth={260} sidebarTone="onDark">
 *   <PageHeader title="Dashboard" />
 *   <main>...</main>
 * </AppShell>
 * ```
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { sidebar, sidebarWidth = 240, sidebarTone = 'default', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('grid min-h-screen', className)}
      style={{ gridTemplateColumns: `${sidebarWidth}px 1fr`, ...(rest.style ?? {}) }}
      {...rest}
    >
      <aside
        className={cn(
          'sticky top-0 h-screen flex flex-col gap-1 p-4',
          sidebarTone === 'onDark'
            ? 'bg-plum-900 text-paper-50'
            : 'bg-surface text-ink border-r border-border',
        )}
      >
        {sidebar}
      </aside>
      <main className="min-w-0 overflow-x-hidden">{children}</main>
    </div>
  )
})
