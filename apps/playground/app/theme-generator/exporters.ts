/**
 * Theme exporters — pure functions that serialise a `Theme` into one of
 * the four download formats surfaced in the UI.
 *
 * All functions are side-effect free (no DOM access, no I/O).
 */

import {
  type Theme,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
  SPACING_BASE_PX,
} from './theme-state'

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
]
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = ['sm', 'md', 'lg', 'hover', 'active']
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_KEYS: ReadonlyArray<MotionEasingKey> = ['memphis', 'out', 'in-out']

const shadowMemphisToCss = (shadow: { x: number; y: number; color: string }): string =>
  `${shadow.x}px ${shadow.y}px 0 ${shadow.color}`

const radiusToCss = (key: RadiusKey, value: number): string => {
  if (key === 'pill') return '999px'
  if (key === 'full') return '50%'
  if (value === 0) return '0'
  return `${value}px`
}

const sizeKey = (k: TypographySizeKey): string => (k === 'base' ? '--text-base' : `--text-${k}`)
const radiusKey = (k: RadiusKey): string => `--radius-${k}`
const shadowMemphisKey = (k: ShadowMemphisKey): string => {
  if (k === 'md') return '--shadow-memphis'
  return `--shadow-memphis-${k}`
}
const shadowSoftKey = (k: 'sm' | 'md' | 'lg'): string => `--shadow-${k}`
const durationKey = (k: MotionDurationKey): string => `--duration-${k}`
const easingKey = (k: MotionEasingKey): string => `--ease-${k}`

/**
 * Emit a `:root` block with every token flattened as a CSS custom property.
 */
export function buildCssExport(theme: Theme): string {
  const lines: string[] = [':root {']

  // Colors
  Object.entries(theme.colors).forEach(([k, v]) => {
    lines.push(`  --${k}: ${v};`)
  })

  // Typography
  lines.push(`  --font-display: ${theme.typography.fontDisplay};`)
  lines.push(`  --font-body: ${theme.typography.fontBody};`)
  lines.push(`  --font-mono: ${theme.typography.fontMono};`)
  SIZE_KEYS.forEach((k) => {
    lines.push(`  ${sizeKey(k)}: ${theme.typography.sizes[k]}px;`)
  })

  // Radius
  RADIUS_KEYS.forEach((k) => {
    lines.push(`  ${radiusKey(k)}: ${radiusToCss(k, theme.radius[k])};`)
  })

  // Shadow — memphis
  lines.push(`  --shadow-memphis-color: ${theme.shadowMemphis.md.color};`)
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    lines.push(`  ${shadowMemphisKey(k)}: ${shadowMemphisToCss(theme.shadowMemphis[k])};`)
  })

  // Shadow — soft
  lines.push(`  --shadow-none: none;`)
  lines.push(`  ${shadowSoftKey('sm')}: 0 1px 2px rgba(0, 0, 0, ${theme.shadowSoft.sm});`)
  lines.push(`  ${shadowSoftKey('md')}: 0 2px 8px rgba(0, 0, 0, ${theme.shadowSoft.md});`)
  lines.push(`  ${shadowSoftKey('lg')}: 0 8px 24px rgba(0, 0, 0, ${theme.shadowSoft.lg});`)

  // Spacing — every space-N scaled by the theme multiplier
  SPACING_BASE_PX.forEach(([name, px]) => {
    const scaled = Math.round(px * theme.spacing.scale)
    lines.push(`  --${name}: ${scaled}px;`)
  })

  // Motion
  DURATION_KEYS.forEach((k) => {
    lines.push(`  ${durationKey(k)}: ${theme.motion.durations[k]}ms;`)
  })
  EASING_KEYS.forEach((k) => {
    lines.push(`  ${easingKey(k)}: ${theme.motion.easings[k]};`)
  })

  lines.push('}')
  return lines.join('\n')
}

/**
 * Emit a Tailwind v4 preset that maps token var()s to utility class groups.
 * Returned value is a drop-in replacement for `tailwind.preset.ts`.
 */
export function buildTailwindExport(theme: Theme): string {
  const colorPairs = Object.keys(theme.colors)
    .map((k) => `        '${k}': 'var(--${k})',`)
    .join('\n')

  const radiusPairs = RADIUS_KEYS.map((k) => `        '${k}': 'var(--radius-${k})',`).join('\n')

  const shadowPairs = SHADOW_MEMPHIS_KEYS.map((k) => {
    const cssKey = k === 'md' ? 'shadow-memphis' : `shadow-memphis-${k}`
    const utilKey = k === 'md' ? 'memphis' : `memphis-${k}`
    return `        '${utilKey}': 'var(--${cssKey})',`
  }).join('\n')

  const durationPairs = DURATION_KEYS.map(
    (k) => `        '${k}': 'var(--duration-${k})',`,
  ).join('\n')
  const easingPairs = EASING_KEYS.map((k) => `        '${k}': 'var(--ease-${k})',`).join('\n')

  return `/**
 * Generated Tailwind preset — import this file from your tailwind.config.
 * Expects tokens.css (or equivalent) to declare every referenced CSS var.
 */
const preset = {
  theme: {
    extend: {
      colors: {
${colorPairs}
      },
      fontFamily: {
        display: 'var(--font-display)'.split(',').map((s) => s.trim()),
        body: 'var(--font-body)'.split(',').map((s) => s.trim()),
        mono: 'var(--font-mono)'.split(',').map((s) => s.trim()),
      },
      borderRadius: {
${radiusPairs}
      },
      boxShadow: {
${shadowPairs}
      },
      transitionDuration: {
${durationPairs}
      },
      transitionTimingFunction: {
${easingPairs}
      },
    },
  },
}

export default preset
`
}

/**
 * Flatten tokens into dot-path keys. Stable across renders.
 */
function flattenTheme(theme: Theme): Record<string, string | number> {
  const out: Record<string, string | number> = {}

  Object.entries(theme.colors).forEach(([k, v]) => {
    out[`colors.${k}`] = v
  })

  out['typography.fontDisplay'] = theme.typography.fontDisplay
  out['typography.fontBody'] = theme.typography.fontBody
  out['typography.fontMono'] = theme.typography.fontMono
  SIZE_KEYS.forEach((k) => {
    out[`typography.sizes.${k}`] = theme.typography.sizes[k]
  })

  RADIUS_KEYS.forEach((k) => {
    out[`radius.${k}`] = theme.radius[k]
  })

  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    const s = theme.shadowMemphis[k]
    out[`shadowMemphis.${k}.x`] = s.x
    out[`shadowMemphis.${k}.y`] = s.y
    out[`shadowMemphis.${k}.color`] = s.color
  })

  out['shadowSoft.sm'] = theme.shadowSoft.sm
  out['shadowSoft.md'] = theme.shadowSoft.md
  out['shadowSoft.lg'] = theme.shadowSoft.lg

  out['spacing.scale'] = theme.spacing.scale

  DURATION_KEYS.forEach((k) => {
    out[`motion.durations.${k}`] = theme.motion.durations[k]
  })
  EASING_KEYS.forEach((k) => {
    out[`motion.easings.${k}`] = theme.motion.easings[k]
  })

  return out
}

/**
 * Emit the theme as pretty-printed JSON keyed by dot-paths.
 */
export function buildJsonExport(theme: Theme): string {
  return JSON.stringify(flattenTheme(theme), null, 2)
}

type FigmaToken = { value: string; type: string }

/**
 * Emit a Figma Tokens Studio compatible JSON. The top-level `global`
 * set contains grouped token sub-sets (color, typography, radius, …).
 */
export function buildFigmaExport(theme: Theme): string {
  const color: Record<string, FigmaToken> = {}
  Object.entries(theme.colors).forEach(([k, v]) => {
    color[k] = { value: v, type: 'color' }
  })

  const typography: Record<string, FigmaToken> = {
    fontDisplay: { value: theme.typography.fontDisplay, type: 'fontFamilies' },
    fontBody: { value: theme.typography.fontBody, type: 'fontFamilies' },
    fontMono: { value: theme.typography.fontMono, type: 'fontFamilies' },
  }
  SIZE_KEYS.forEach((k) => {
    typography[`size-${k}`] = { value: `${theme.typography.sizes[k]}px`, type: 'fontSizes' }
  })

  const radius: Record<string, FigmaToken> = {}
  RADIUS_KEYS.forEach((k) => {
    radius[k] = { value: radiusToCss(k, theme.radius[k]), type: 'borderRadius' }
  })

  const shadowMemphis: Record<string, FigmaToken> = {}
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    shadowMemphis[k] = {
      value: shadowMemphisToCss(theme.shadowMemphis[k]),
      type: 'boxShadow',
    }
  })

  const spacing: Record<string, FigmaToken> = {
    scale: { value: String(theme.spacing.scale), type: 'sizing' },
  }
  SPACING_BASE_PX.forEach(([name, px]) => {
    spacing[name] = {
      value: `${Math.round(px * theme.spacing.scale)}px`,
      type: 'sizing',
    }
  })

  const motion: Record<string, FigmaToken> = {}
  DURATION_KEYS.forEach((k) => {
    motion[`duration-${k}`] = { value: `${theme.motion.durations[k]}ms`, type: 'other' }
  })
  EASING_KEYS.forEach((k) => {
    motion[`ease-${k}`] = { value: theme.motion.easings[k], type: 'other' }
  })

  return JSON.stringify(
    {
      global: {
        color,
        typography,
        radius,
        shadowMemphis,
        spacing,
        motion,
      },
    },
    null,
    2,
  )
}
