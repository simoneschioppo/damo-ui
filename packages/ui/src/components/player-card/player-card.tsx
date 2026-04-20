import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface PlayerCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string
  elo: number | string
  /** Game mode, e.g. 'RAPID' | 'BLITZ'. Rendered uppercase in the meta line. */
  mode: string
  /** Clock display, e.g. '05:42'. */
  clock: string
  /** Custom avatar node. Defaults to the first letter of `name` in a plum-900 circle. */
  avatar?: ReactNode
  /** Optional color suffix shown next to the name. */
  color?: 'bianco' | 'nero'
}

function capitalize(value: string): string {
  if (value.length === 0) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * PlayerCard — horizontal player row with avatar, name + ELO/mode meta, and a
 * gold-accented clock box. Memphis frame (2px border-memphis + 4px black shadow).
 */
export const PlayerCard = forwardRef<HTMLDivElement, PlayerCardProps>(function PlayerCard(
  { name, elo, mode, clock, avatar, color, className, ...rest },
  ref,
) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  const displayName = color ? `${name} · ${capitalize(color)}` : name

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[14px] w-full p-4',
        'border-2 border-border-memphis bg-surface',
        className,
      )}
      style={{ boxShadow: '4px 4px 0 var(--border-memphis)' }}
      {...rest}
    >
      {avatar ? (
        <div
          data-slot="avatar"
          className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-border-memphis bg-plum-900 text-paper-50"
        >
          {avatar}
        </div>
      ) : (
        <div
          data-slot="avatar"
          className="shrink-0 grid place-items-center w-12 h-12 rounded-full border-2 border-border-memphis bg-plum-900 text-paper-50 font-display font-bold"
          style={{ fontSize: 20 }}
        >
          {initial}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div
          data-slot="name"
          className="font-bold text-ink"
          style={{ fontSize: 15 }}
        >
          {displayName}
        </div>
        <div
          data-slot="meta"
          className="font-mono uppercase text-ink-muted mt-0.5"
          style={{ fontSize: 11, letterSpacing: '0.08em' }}
        >
          ELO {elo} · {mode}
        </div>
      </div>
      <div
        data-slot="clock"
        className="font-mono font-bold text-ink border-2 border-gold-500 bg-paper-50"
        style={{
          padding: '8px 14px',
          fontSize: 14,
          boxShadow: '2px 2px 0 var(--gold-500)',
        }}
      >
        {clock}
      </div>
    </div>
  )
})
