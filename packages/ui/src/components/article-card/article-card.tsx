'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Card } from '../card'
import { cn } from '../../lib/cn'

export interface ArticleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional eyebrow label shown above the title (e.g. 'REGOLA'). */
  label?: string
  title: string
  /** Body content. Multi-paragraph allowed. */
  children: ReactNode
}

/**
 * ArticleCard — neutral content card (max-width 420px). Composes <Card> for
 * frame + shadow; keeps a bespoke eyebrow label, display-font title, and
 * relaxed-leading body.
 */
export const ArticleCard = forwardRef<HTMLDivElement, ArticleCardProps>(function ArticleCard(
  { label, title, children, className, ...rest },
  ref,
) {
  return (
    <Card
      ref={ref}
      variant="default"
      padding="none"
      className={cn('p-6 max-w-[420px]', className)}
      {...rest}
    >
      {label && (
        <div
          data-slot="label"
          className="font-mono font-bold uppercase text-muted-foreground text-xs mb-2"
          style={{ letterSpacing: '0.2em' }}
        >
          {label}
        </div>
      )}
      <h4 data-slot="title" className="font-display text-foreground text-xl m-0 mb-3 leading-tight">
        {title}
      </h4>
      <div data-slot="body" className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </Card>
  )
})
