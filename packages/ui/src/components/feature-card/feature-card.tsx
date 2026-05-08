'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Card } from '../card'
import { cn } from '../../lib/cn'

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string
  desc: string
  /** Secondary meta line (mono), e.g. '15+10'. */
  meta?: string
  /** Optional icon rendered in the footer row next to the meta. */
  icon?: ReactNode
}

/**
 * FeatureCard — 280px wide feature/highlight card. Composes <Card variant="featured">
 * which provides the Memphis frame and primary-tinted shadow via the
 * `--memphis-shadow-color: var(--primary)` override. Display-font title, ink
 * description, optional mono meta + icon footer row.
 */
export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(function FeatureCard(
  { title, desc, meta, icon, className, ...rest },
  ref,
) {
  return (
    <Card
      ref={ref}
      variant="featured"
      padding="md"
      className={cn('w-[280px]', className)}
      {...rest}
    >
      <h4
        data-slot="title"
        className="font-display uppercase text-foreground text-2xl m-0 mb-2"
        style={{ letterSpacing: '0.02em' }}
      >
        {title}
      </h4>
      <p data-slot="desc" className="text-muted-foreground text-sm m-0 mb-6 leading-snug">
        {desc}
      </p>
      {(meta || icon) && (
        <div className="flex items-center justify-between">
          {meta ? (
            <span
              data-testid="feature-card-meta"
              data-slot="meta"
              className="font-mono font-bold text-muted-foreground uppercase text-xs"
              style={{ letterSpacing: '0.08em' }}
            >
              {meta}
            </span>
          ) : (
            <span />
          )}
          {icon && (
            <span data-slot="icon" className="text-muted-foreground inline-flex items-center">
              {icon}
            </span>
          )}
        </div>
      )}
    </Card>
  )
})
