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
// the playground DS page: color-mix background over `--surface`, 2px Memphis
// border, 4px solid Memphis shadow, 40x40 numbered icon tile.
//
// Tailwind covers all tokens except the `color-mix(...)` background and the
// custom Memphis shadow — those go through inline `style` because Tailwind
// can't express them concisely.
export const Hint = forwardRef<HTMLDivElement, HintProps>(function Hint(
  { num, title, children, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-4 p-5 items-start mb-6 border-2 border-memphis',
        className,
      )}
      style={{
        background: 'color-mix(in oklab, var(--secondary) 22%, var(--card))',
        boxShadow: '4px 4px 0 var(--memphis-shadow-color)',
        ...style,
      }}
      {...rest}
    >
      <div
        className={cn(
          'shrink-0 w-10 h-10 grid place-items-center',
          'border-2 border-memphis bg-secondary text-secondary-foreground',
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
