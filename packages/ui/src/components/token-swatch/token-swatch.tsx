'use client'

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface TokenSwatchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Human-readable token name, e.g. "Background". */
  name: string
  /** CSS custom property the swatch visualizes, e.g. "--bg". */
  cssVar: string
  /** Short usage caption rendered below the name. */
  usage: string
  className?: string
}

// Memphis-styled semantic token card. Renders a filled tile that reads from
// the referenced CSS variable so live palette swaps update the preview. The
// name is uppercased mono, the cssVar is shown in --primary, and the usage
// caption uses --muted-foreground.
export const TokenSwatch = forwardRef<HTMLDivElement, TokenSwatchProps>(function TokenSwatch(
  { name, cssVar, usage, className, ...rest },
  ref,
) {
  const rootStyle: CSSProperties = {
    padding: 16,
    border: '2px solid var(--memphis-border-color)',
    background: 'var(--card)',
    boxShadow: 'var(--shadow-memphis-sm)',
  }
  const tileStyle: CSSProperties = {
    width: '100%',
    height: 44,
    background: `var(${cssVar})`,
    border: '2px solid var(--memphis-border-color)',
    marginBottom: 10,
  }
  const nameStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: 'var(--foreground)',
  }
  const cssVarStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--primary)',
    marginTop: 2,
    fontWeight: 700,
  }
  const usageStyle: CSSProperties = {
    fontSize: 11,
    color: 'var(--muted-foreground)',
    marginTop: 6,
    lineHeight: 1.35,
  }

  return (
    <div ref={ref} className={cn(className)} style={rootStyle} {...rest}>
      <div data-token-swatch-tile style={tileStyle} />
      <div style={nameStyle}>{name}</div>
      <div style={cssVarStyle}>{cssVar}</div>
      <div style={usageStyle}>{usage}</div>
    </div>
  )
})
