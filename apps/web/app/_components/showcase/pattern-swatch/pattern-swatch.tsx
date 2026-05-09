'use client'

import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from 'damo-ui'

export interface PatternSwatchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string
  /** CSS `background` shorthand (gradient, repeating, etc.) forwarded to the tile. */
  background?: string
  /** CSS `background-size` forwarded to the tile. */
  backgroundSize?: string
  /** CSS `background-color` forwarded to the tile. */
  backgroundColor?: string
  /** Optional SVG or element overlay rendered inside the tile. */
  children?: ReactNode
  className?: string
}

// Memphis-styled pattern tile used in the design system page. Renders a header
// eyebrow with the pattern name above an aspect-square tile. The tile's
// background is fully controllable via the `background`, `backgroundSize`, and
// `backgroundColor` props (Tailwind can't express arbitrary gradient shorthands
// so those go through inline style). Children render as an overlay inside the
// tile (typically inline SVGs like WAVES / SCATTER).
export const PatternSwatch = forwardRef<HTMLDivElement, PatternSwatchProps>(function PatternSwatch(
  { name, background, backgroundSize, backgroundColor, children, className, ...rest },
  ref,
) {
  const tileStyle: CSSProperties = {
    ...(background ? { background } : {}),
    ...(backgroundSize ? { backgroundSize } : {}),
    ...(backgroundColor ? { backgroundColor } : {}),
  }

  return (
    <div
      ref={ref}
      className={cn('inline-flex flex-col border-2 border-memphis rounded-none', className)}
      {...rest}
    >
      <span
        className={cn(
          'font-mono text-[11px] tracking-[0.22em] uppercase font-bold text-primary',
          'px-3 py-2 border-b-2 border-memphis',
        )}
      >
        {name}
      </span>
      <div className="aspect-square bg-background relative overflow-hidden" style={tileStyle}>
        {children}
      </div>
    </div>
  )
})
