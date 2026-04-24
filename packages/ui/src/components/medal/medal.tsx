'use client'

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

// Heptagon vertices on a 64x64 viewBox centered at (32, 32).
// INNER_SCALE controls border thickness: inner polygon is OUTER scaled toward
// the center. Higher = thinner border (closer to the outer edge).
const CENTER = 32
const INNER_SCALE = 0.85

const OUTER_COORDS: ReadonlyArray<readonly [number, number]> = [
  [32, 4],
  [54, 14],
  [58, 38],
  [42, 58],
  [22, 58],
  [6, 38],
  [10, 14],
]

const toPoints = (coords: ReadonlyArray<readonly [number, number]>) =>
  coords.map(([x, y]) => `${x},${y}`).join(' ')

const OUTER_POINTS = toPoints(OUTER_COORDS)
const INNER_POINTS = toPoints(
  OUTER_COORDS.map(([x, y]) => [
    CENTER + (x - CENTER) * INNER_SCALE,
    CENTER + (y - CENTER) * INNER_SCALE,
  ]),
)

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
          strokeWidth="0.5"
        />
        <polygon points={INNER_POINTS} fill={innerFill} />
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
