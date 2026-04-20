import { forwardRef, type SVGAttributes } from 'react'
import { cn } from '../../lib/cn'

export type MemphisShapeVariant =
  | 'diamond'
  | 'circle'
  | 'triangle'
  | 'zigzag'
  | 'blob'
  | 'wave'
  | 'star'
  | 'lbar'

export interface MemphisShapeProps extends Omit<SVGAttributes<SVGSVGElement>, 'fill'> {
  variant: MemphisShapeVariant
  /** px size applied to both width + height. Default 64. */
  size?: number
  /** CSS color applied as fill (or stroke on stroke-only variants). Default var(--plum-500). */
  color?: string
  className?: string
}

// Memphis shape primitives used as decorative accents. All variants render a
// pure SVG with viewBox 0 0 100 100 so they scale cleanly. Filled variants
// (diamond, circle, triangle, blob, star, lbar) receive `fill={color}`, while
// stroke-only variants (zigzag, wave) receive `stroke={color}` with `fill=none`.
export const MemphisShape = forwardRef<SVGSVGElement, MemphisShapeProps>(function MemphisShape(
  { variant, size = 64, color = 'var(--plum-500)', className, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn(className)}
      aria-hidden="true"
      {...rest}
    >
      {renderVariant(variant, color)}
    </svg>
  )
})

function renderVariant(variant: MemphisShapeVariant, color: string) {
  switch (variant) {
    case 'diamond':
      // Rotated square polygon (45° diamond centered in viewBox).
      return <polygon points="50,6 94,50 50,94 6,50" fill={color} />

    case 'circle':
      return <circle cx="50" cy="50" r="44" fill={color} />

    case 'triangle':
      return <polygon points="50,10 90,90 10,90" fill={color} />

    case 'zigzag':
      // 3 zig-zags across the viewBox.
      return (
        <polyline
          points="6,30 22,70 38,30 54,70 70,30 86,70 94,50"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )

    case 'blob':
      // Irregular rounded blob matching the CSS
      // borderRadius: 60% 40% 70% 30% / 40% 50% 50% 60% approximation.
      return (
        <path
          d="M50 6 C72 6 94 20 94 42 C94 64 86 82 66 92 C46 102 22 88 12 68 C2 48 10 24 28 14 C36 9 42 6 50 6 Z"
          fill={color}
        />
      )

    case 'wave':
      // Smooth sine path across the viewBox.
      return (
        <path
          d="M4 50 Q 20 10 36 50 T 68 50 T 96 50"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
      )

    case 'star': {
      // 5-point star (10 vertices alternating outer/inner radii around cx=50 cy=50).
      const points = [
        '50,6',
        '62,38',
        '94,38',
        '68,58',
        '78,90',
        '50,70',
        '22,90',
        '32,58',
        '6,38',
        '38,38',
      ].join(' ')
      return <polygon points={points} fill={color} />
    }

    case 'lbar':
      // L-shaped bars: a top horizontal bar + a left vertical bar.
      return (
        <path d="M10 10 H 90 V 28 H 28 V 90 H 10 Z" fill={color} />
      )

    default: {
      // Exhaustiveness guard — should never hit at runtime due to TS.
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}
