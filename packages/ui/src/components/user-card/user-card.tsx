'use client'

import { forwardRef, type ReactNode } from 'react'
import { Card, type CardProps } from '../card'
import { cn } from '../../lib/cn'

/**
 * UserCard wraps `<Card variant="default" padding="none">` with a fixed
 * row layout; both Card axes are wrapper-controlled. Consumers cannot
 * override `variant` or `padding` (enforced via `Omit` and the
 * hardcoded values on the underlying `<Card>` call).
 */
export interface UserCardProps extends Omit<CardProps, 'children' | 'variant' | 'padding'> {
  name: string
  /** Custom avatar node. Defaults to the first letter of `name` in a circle. */
  avatar?: ReactNode
  /** Optional mono caption line rendered under the name. */
  meta?: ReactNode
  /** Optional right-aligned slot (e.g. clock chip, badge, action). */
  trailing?: ReactNode
  className?: string
}

/**
 * UserCard — horizontal row with avatar, name + optional meta line, and an
 * optional right-aligned slot. Composes <Card> for the Memphis frame and
 * shadow; layout (flex row, gap, full-width, p-4 padding) is added on top.
 */
export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(function UserCard(
  { name, avatar, meta, trailing, className, ...rest },
  ref,
) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <Card
      ref={ref}
      variant="default"
      padding="none"
      className={cn('flex items-center gap-[14px] w-full p-4', className)}
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
          className="shrink-0 grid place-items-center w-12 h-12 rounded-full border-2 border-memphis bg-foreground text-background font-display font-bold text-xl"
        >
          {initial}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div data-slot="name" className="font-bold text-card-foreground text-base">
          {name}
        </div>
        {meta !== undefined && meta !== null && (
          <div
            data-slot="meta"
            className="font-mono uppercase text-muted-foreground text-xs mt-0.5"
            style={{ letterSpacing: '0.08em' }}
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
    </Card>
  )
})
