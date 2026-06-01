'use client'

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '@axologic/ui'
import { useResolvedCssVars } from '@axologic/ui'

export interface ColorStop {
  k: number
}

export interface ColorScaleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Human-readable scale name, e.g. "Ink". */
  name: string
  /** Token root, e.g. "ink" (yields CSS vars `--ink-{k}`). */
  token: string
  /** Optional tagline rendered in italic at the top-right. */
  desc?: string
  /** Ordered list of stops — one cell per stop rendered left→right. */
  stops: ReadonlyArray<ColorStop>
  className?: string
}

// Pick readable text color (black or white) for a given background hex.
// Uses perceptual luminance. Falls back to dark ink for unknown inputs.
function pickContrastText(hex: string): string {
  const m = hex.replace(/\s+/g, '').match(/^#?([a-f\d]{6})$/i)
  if (!m || !m[1]) return 'rgba(0,0,0,0.8)'
  const hx = m[1]
  const r = parseInt(hx.slice(0, 2), 16)
  const g = parseInt(hx.slice(2, 4), 16)
  const b = parseInt(hx.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.62 ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.94)'
}

// Renders a horizontal band of color stops for a scale (Ink, Brand, …).
// Header shows the scale name + `--{token}-*` + optional italic desc.
// Body is a grid with one cell per stop — each cell resolves its CSS var at
// runtime to render the hex and pick a contrast-aware text color so labels
// stay legible across palette swaps.
export const ColorScale = forwardRef<HTMLDivElement, ColorScaleProps>(function ColorScale(
  { name, token, desc, stops, className, ...rest },
  ref,
) {
  const varNames = stops.map((s) => `--${token}-${s.k}`)
  const resolved = useResolvedCssVars(varNames)

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 12,
  }
  const titleGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 12,
  }
  const titleStyle: CSSProperties = { fontSize: 28, margin: 0, color: 'var(--foreground)' }
  const tokenLabelStyle: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--primary)',
    fontWeight: 700,
  }
  const descStyle: CSSProperties = {
    color: 'var(--muted-foreground)',
    fontSize: 13,
    fontStyle: 'italic',
  }
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${stops.length}, 1fr)`,
    border: '2px solid var(--memphis-border-color)',
    boxShadow: 'var(--shadow-memphis)',
    overflow: 'hidden',
  }
  const rootStyle: CSSProperties = { marginBottom: 32 }

  return (
    <div ref={ref} className={cn(className)} style={rootStyle} {...rest}>
      <div style={headerStyle}>
        <div style={titleGroupStyle}>
          <h3 className="display" style={titleStyle}>
            {name}
          </h3>
          <span style={tokenLabelStyle}>--{token}-*</span>
        </div>
        {desc ? <div style={descStyle}>{desc}</div> : null}
      </div>
      <div data-color-scale-grid style={gridStyle}>
        {stops.map((s, idx) => {
          const cssVar = `--${token}-${s.k}`
          const hex = resolved[cssVar] ?? ''
          const cellStyle: CSSProperties = {
            background: `var(${cssVar})`,
            color: pickContrastText(hex),
            aspectRatio: '1.2 / 1',
            padding: '14px 12px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            borderLeft: idx === 0 ? 'none' : '2px solid var(--memphis-border-color)',
          }
          return (
            <div key={s.k} data-color-scale-stop style={cellStyle}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                {token}-{s.k}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  opacity: 0.85,
                  marginTop: 2,
                }}
              >
                {hex || '\u00a0'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
