'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ShowcaseCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Optional monospace eyebrow label rendered at the top of the card. */
  label?: string
  /** Card body content. */
  children: ReactNode
  className?: string
}

// Faithful port of the design-system `.ds-card`: card surface, 2px Memphis
// border, Memphis card shadow (`--shadow-memphis-card`, default 4px), 28px
// padding (p-7), and an optional monospace eyebrow label at the top.
export const ShowcaseCard = forwardRef<HTMLDivElement, ShowcaseCardProps>(function ShowcaseCard(
  { label, children, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('p-7 relative', className)}
      style={{
        background: 'var(--card)',
        border: '2px solid var(--memphis-border-color)',
        boxShadow: 'var(--shadow-memphis-card)',
        ...style,
      }}
      {...rest}
    >
      {label ? (
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-primary mb-4 font-bold block">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  )
})
