import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type MedalRank = 'bronze' | 'silver' | 'gold' | 'master' | 'grandmaster'

export interface MedalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  rank: MedalRank
  /** Label shown below the medal (eyebrow caption). */
  label?: string
  /**
   * Content rendered inside the medal (digits, letters, or any ReactNode).
   * When absent, the SVG has no text. Accepts `1`, `"M"`, `"GM"`, etc.
   */
  value?: ReactNode
  /** Total SVG size in px (width + height). */
  size?: number
}

const DEFAULT_SIZE = 96

// Octagon point coordinates on a 64x64 viewBox — ported from the reference
// MedalSvg (apps/playground/app/design-system/page.tsx). The viewBox is held
// constant and `size` scales width/height so proportions remain identical.
const OUTER_POINTS = '32,4 54,14 58,38 42,58 22,58 6,38 10,14'
const INNER_POINTS = '32,14 48,20 50,36 40,50 24,50 14,36 16,20'

export const Medal = forwardRef<HTMLDivElement, MedalProps>(function Medal(
  { rank, label, value, size = DEFAULT_SIZE, className, ...rest },
  ref,
) {
  const outerFill = `var(--medal-${rank}-outer)`
  const innerFill = `var(--medal-${rank}-inner)`
  const textFill = `var(--medal-${rank}-text)`

  return (
    <div
      ref={ref}
      className={cn('inline-flex flex-col items-center gap-1', className)}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-label={label ?? `${rank} medal`}
        role="img"
      >
        <polygon
          points={OUTER_POINTS}
          fill={outerFill}
          stroke="var(--border-memphis)"
          strokeWidth="2"
        />
        <polygon
          points={INNER_POINTS}
          fill={innerFill}
          stroke="var(--border-memphis)"
          strokeWidth="1"
        />
        {value !== undefined && value !== null && (
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontSize="22"
            fontWeight="700"
            fill={textFill}
          >
            {value}
          </text>
        )}
      </svg>
      {label && (
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
      )}
    </div>
  )
})
