'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
  delta?: ReactNode
  deltaTone?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, delta, deltaTone = 'neutral', icon, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest}>
      <div className="flex items-center gap-2">
        {icon && <span className="inline-flex text-ink-muted">{icon}</span>}
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted font-mono">
          {label}
        </span>
      </div>
      <span className="font-display text-3xl leading-none text-ink">{value}</span>
      {delta !== undefined && (
        <span
          className={cn(
            'text-xs font-semibold font-mono',
            deltaTone === 'positive' && 'text-success',
            deltaTone === 'negative' && 'text-danger',
            deltaTone === 'neutral' && 'text-ink-muted',
          )}
        >
          {delta}
        </span>
      )}
    </div>
  )
})
