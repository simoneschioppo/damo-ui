'use client'

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
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
 * FeatureCard — 280px wide feature/highlight card. Memphis frame with the
 * Memphis card shadow (`--shadow-memphis-card`) recoloured to `--primary` via
 * a scoped `--memphis-shadow-color` override, so customising the token in the
 * theme generator updates this card too. Display-font title, ink description,
 * optional mono meta + icon footer row.
 */
export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(function FeatureCard(
  { title, desc, meta, icon, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('p-5 border-2 border-memphis rounded-none bg-card', className)}
      style={
        {
          width: '280px',
          '--memphis-shadow-color': 'var(--primary)',
          boxShadow: 'var(--shadow-memphis-card)',
        } as CSSProperties
      }
      {...rest}
    >
      <h4
        data-slot="title"
        className="font-display uppercase text-foreground text-2xl m-0"
        style={{ letterSpacing: '0.02em', marginBottom: 8 }}
      >
        {title}
      </h4>
      <p
        data-slot="desc"
        className="text-muted-foreground text-sm m-0"
        style={{ lineHeight: 1.4, marginBottom: 24 }}
      >
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
    </div>
  )
})
