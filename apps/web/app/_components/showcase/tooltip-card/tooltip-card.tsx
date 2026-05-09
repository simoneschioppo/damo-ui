'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from 'damo-ui'

export interface TooltipCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  label: string
  title: string
  body: string
}

/**
 * TooltipCard — tooltip/popover style card. Memphis frame (2px border-memphis
 * + 4px black shadow) with a gold diamond badge floating top-right.
 */
export const TooltipCard = forwardRef<HTMLDivElement, TooltipCardProps>(function TooltipCard(
  { label, title, body, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('relative', className)} {...rest}>
      <div
        aria-hidden
        data-slot="diamond"
        className="absolute bg-primary border-2 border-memphis"
        style={{
          top: -7,
          right: 20,
          width: 16,
          height: 16,
          transform: 'rotate(45deg)',
        }}
      />
      <div
        data-slot="surface"
        className="p-4 border-2 border-memphis bg-card"
        style={{ boxShadow: 'var(--shadow-memphis-card)' }}
      >
        <div
          data-slot="label"
          className="font-mono font-bold uppercase text-muted-foreground"
          style={{ fontSize: 10, letterSpacing: '0.2em' }}
        >
          {label}
        </div>
        <div
          data-slot="title"
          className="font-display text-card-foreground"
          style={{ fontSize: 22, lineHeight: 1.15, marginTop: 8 }}
        >
          {title}
        </div>
        <p
          data-slot="body"
          className="text-muted-foreground m-0"
          style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6 }}
        >
          {body}
        </p>
      </div>
    </div>
  )
})
