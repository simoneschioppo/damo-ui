import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ModeCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string
  desc: string
  /** Secondary meta line (mono), e.g. '15+10'. */
  meta?: string
  /** Optional icon rendered in the footer row next to the meta. */
  icon?: ReactNode
}

/**
 * ModeCard — 280px wide card for a game mode. Memphis frame with 4px gold-500
 * shadow. Display-font title, ink description, optional mono meta + icon.
 */
export const ModeCard = forwardRef<HTMLDivElement, ModeCardProps>(function ModeCard(
  { title, desc, meta, icon, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'p-5 border-2 border-border-memphis bg-surface',
        className,
      )}
      style={{ width: '280px', boxShadow: '4px 4px 0 var(--gold-500)' }}
      {...rest}
    >
      <h4
        data-slot="title"
        className="font-display uppercase text-ink m-0"
        style={{ fontSize: 24, letterSpacing: '0.02em', marginBottom: 8 }}
      >
        {title}
      </h4>
      <p
        data-slot="desc"
        className="text-ink-muted m-0"
        style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 24 }}
      >
        {desc}
      </p>
      {(meta || icon) && (
        <div className="flex items-center justify-between">
          {meta ? (
            <span
              data-testid="mode-card-meta"
              data-slot="meta"
              className="font-mono font-bold text-ink-muted uppercase"
              style={{ fontSize: 12, letterSpacing: '0.08em' }}
            >
              {meta}
            </span>
          ) : (
            <span />
          )}
          {icon && (
            <span data-slot="icon" className="text-ink-muted inline-flex items-center">
              {icon}
            </span>
          )}
        </div>
      )}
    </div>
  )
})
