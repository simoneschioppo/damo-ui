'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ArticleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional eyebrow label shown above the title (e.g. 'REGOLA'). */
  label?: string
  title: string
  /** Body content. Multi-paragraph allowed. */
  children: ReactNode
}

/**
 * ArticleCard — neutral content card (max-width 420px). Memphis frame (2px
 * border-memphis + 4px black shadow), optional eyebrow label, display-font
 * title, and a relaxed-leading ink-soft body.
 */
export const ArticleCard = forwardRef<HTMLDivElement, ArticleCardProps>(function ArticleCard(
  { label, title, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('p-6 border-2 border-memphis rounded-none bg-card', className)}
      style={{ maxWidth: '420px', boxShadow: 'var(--shadow-memphis-card)' }}
      {...rest}
    >
      {label && (
        <div
          data-slot="label"
          className="font-mono font-bold uppercase text-muted-foreground text-xs"
          style={{ letterSpacing: '0.2em', marginBottom: 8 }}
        >
          {label}
        </div>
      )}
      <h4
        data-slot="title"
        className="font-display text-foreground text-xl m-0"
        style={{ lineHeight: 1.15, marginBottom: 12 }}
      >
        {title}
      </h4>
      <div data-slot="body" className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
})
