'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface OrnamentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const Ornament = forwardRef<HTMLDivElement, OrnamentProps>(function Ornament(
  { className, children, ...rest },
  ref,
) {
  const defaultGlyph = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2 L13 10 L10 18 L7 10 Z" />
    </svg>
  )

  return (
    <div
      ref={ref}
      role="separator"
      aria-hidden="true"
      className={cn('flex items-center gap-3 text-primary', className)}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
        }}
      />
      <span style={{ flexShrink: 0, display: 'grid', placeItems: 'center' }}>
        {children ?? defaultGlyph}
      </span>
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
        }}
      />
    </div>
  )
})
