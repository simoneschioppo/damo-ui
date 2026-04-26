'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface UserCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string
  /** Custom avatar node. Defaults to the first letter of `name` in a plum-900 circle. */
  avatar?: ReactNode
  /** Optional mono caption line rendered under the name. */
  meta?: ReactNode
  /** Optional right-aligned slot (e.g. clock chip, badge, action). */
  trailing?: ReactNode
  className?: string
}

/**
 * UserCard — horizontal row with avatar, name + optional meta line, and an
 * optional right-aligned slot. Memphis frame (2px border-memphis + 4px black
 * shadow). Slots replace the previous domain-specific elo/mode/clock props.
 */
export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(function UserCard(
  { name, avatar, meta, trailing, className, ...rest },
  ref,
) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[14px] w-full p-4',
        'border-2 border-memphis bg-card',
        className,
      )}
      style={{ boxShadow: '4px 4px 0 var(--memphis-border-color)' }}
      {...rest}
    >
      {avatar ? (
        <div
          data-slot="avatar"
          className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-memphis bg-foreground text-background"
        >
          {avatar}
        </div>
      ) : (
        <div
          data-slot="avatar"
          className="shrink-0 grid place-items-center w-12 h-12 rounded-full border-2 border-memphis bg-foreground text-background font-display font-bold"
          style={{ fontSize: 20 }}
        >
          {initial}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div
          data-slot="name"
          className="font-bold text-card-foreground"
          style={{ fontSize: 15 }}
        >
          {name}
        </div>
        {meta !== undefined && meta !== null && (
          <div
            data-slot="meta"
            className="font-mono uppercase text-muted-foreground mt-0.5"
            style={{ fontSize: 11, letterSpacing: '0.08em' }}
          >
            {meta}
          </div>
        )}
      </div>
      {trailing !== undefined && trailing !== null && (
        <div data-slot="trailing" className="shrink-0">
          {trailing}
        </div>
      )}
    </div>
  )
})
