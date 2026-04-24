'use client'

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { chipVariants, type ChipVariants } from './chip.variants'

export interface ChipProps extends HTMLAttributes<HTMLSpanElement>, ChipVariants {
  /**
   * When set, prepends a small round dot (8x8px) before children.
   * Accepts any CSS color string, e.g. `"var(--gold-500)"`, `"#fff"`.
   */
  dotColor?: string
  /**
   * When true, swaps the base surface to the active look:
   * `bg-primary text-primary-foreground border-memphis`. If a `dotColor`
   * is also set, the dot border flips to white for contrast.
   */
  active?: boolean
}

const DOT_BASE_STYLE: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  borderStyle: 'solid',
  borderWidth: '1.5px',
  display: 'inline-block',
  flexShrink: 0,
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { className, variant, size, dotColor, active = false, children, ...rest },
  ref,
) {
  const dotBorderColor = active ? 'white' : 'var(--border-memphis)'
  const dotStyle: CSSProperties = {
    ...DOT_BASE_STYLE,
    background: dotColor ?? 'transparent',
    borderColor: dotBorderColor,
  }

  return (
    <span
      ref={ref}
      className={cn(
        chipVariants({ variant, size }),
        active && 'bg-primary text-primary-foreground border-memphis',
        className,
      )}
      {...rest}
    >
      {dotColor ? <span data-chip-dot="" aria-hidden="true" style={dotStyle} /> : null}
      {children}
    </span>
  )
})
