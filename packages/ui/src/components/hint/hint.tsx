'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface HintProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  num: number
  title: ReactNode
  children: ReactNode
  className?: string
}

// Memphis-styled numbered callout. Visual parity with the original `.hint` from
// the docs DS surface: color-mix background over `--surface`, 2px Memphis
// border, Memphis card shadow (`--shadow-memphis-card`, default 4px), 40x40
// numbered icon tile.
//
// The `color-mix(...)` background can't be expressed via Tailwind, so it stays
// inline alongside the shadow token.
export const Hint = forwardRef<HTMLDivElement, HintProps>(function Hint(
  { num, title, children, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-4 p-5 items-start mb-6 border-2 border-memphis rounded-none',
        className,
      )}
      style={{
        background: 'color-mix(in oklab, var(--secondary) 22%, var(--card))',
        boxShadow: 'var(--shadow-memphis-card)',
        ...style,
      }}
      {...rest}
    >
      <div
        className={cn(
          'shrink-0 w-10 h-10 grid place-items-center',
          'border-2 border-memphis rounded-none bg-secondary text-secondary-foreground',
          'font-display text-lg',
        )}
      >
        {num}
      </div>
      <div className="flex-1">
        <h4 className="font-display text-base mb-1 text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed m-0">{children}</p>
      </div>
    </div>
  )
})
