'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from 'damo-ui'

export interface SubPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Monospace eyebrow label rendered at the top of the panel. */
  label: string
  /** Panel body content. */
  children: ReactNode
  className?: string
}

// Labeled mini-section used to group related examples inside a larger
// showcase card. Renders a dashed 2px border around a `--paper-50` surface
// with a monospace uppercase eyebrow label.
//
// The dashed border + paper background go through inline style so the tokens
// resolve via CSS variables even when Tailwind utilities are overridden.
export const SubPanel = forwardRef<HTMLDivElement, SubPanelProps>(function SubPanel(
  { label, children, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('p-4', className)}
      style={{
        border: '2px dashed var(--border-strong)',
        background: 'var(--paper-50)',
        ...style,
      }}
      {...rest}
    >
      <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-4 block">
        {label}
      </span>
      {children}
    </div>
  )
})
