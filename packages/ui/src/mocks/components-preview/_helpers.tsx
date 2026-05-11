import { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Shared helpers for the ComponentsPreview scene. Lives in its own file so
 * `sections-data-layout.tsx` and the main `components-preview.tsx` can share
 * the `Section` / `Subgroup` layout primitives plus the row data without
 * duplicating definitions. Audit H-19 broke the monolith into focused
 * sub-files; this is the shared core they all import.
 */

interface SectionProps {
  id: string
  title: string
  caption: string
  children: ReactNode
}

export function Section({ id, title, caption, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col gap-5 scroll-mt-4">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-memphis pb-1">
        <h3 className="font-display text-xl leading-none m-0">{title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </span>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

interface SubgroupProps {
  label: string
  children: ReactNode
  /** When true, lay children out in a tight flex row (default). False = vertical stack. */
  inline?: boolean
}

export function Subgroup({ label, children, inline = true }: SubgroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className={cn(inline ? 'flex flex-wrap items-start gap-3' : 'flex flex-col gap-3')}>
        {children}
      </div>
    </div>
  )
}

export const TABLE_ROWS = [
  {
    id: '1',
    name: 'Mario Rossi',
    role: 'Admin',
    last: '2025-04-10',
    badge: 'success' as const,
    label: 'Attivo',
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Editor',
    last: '2025-03-22',
    badge: 'warning' as const,
    label: 'In attesa',
  },
  {
    id: '3',
    name: 'Luca Verdi',
    role: 'Viewer',
    last: '2025-02-04',
    badge: 'destructive' as const,
    label: 'Bloccato',
  },
]
