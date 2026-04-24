/**
 * Theme exporters — pure functions that serialise a `Theme` into one of
 * the four download formats surfaced in the UI.
 *
 * All functions are side-effect free (no DOM access, no I/O).
 */

import {
  type Theme,
  type SemanticTheme,
  type RawPalette,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
  type MedalRank,
  SPACING_BASE_PX,
} from './theme-state'

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = [
  'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl',
]
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = ['sm', 'md', 'lg', 'hover', 'active']
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_KEYS: ReadonlyArray<MotionEasingKey> = ['memphis', 'out', 'in-out']
const MEDAL_RANKS: ReadonlyArray<MedalRank> = ['bronze', 'silver', 'gold', 'master', 'grandmaster']

const CHART_KEYS = ['1', '2', '3', '4', '5'] as const

const shadowMemphisToCss = (s: { x: number; y: number; color: string }): string =>
  `${s.x}px ${s.y}px 0 ${s.color}`

const radiusToCss = (k: RadiusKey, v: number): string => {
  if (k === 'pill') return '999px'
  if (k === 'full') return '50%'
  if (v === 0) return '0'
  return `${v}px`
}

const sizeKey = (k: TypographySizeKey): string => (k === 'base' ? '--text-base' : `--text-${k}`)
const radiusKey = (k: RadiusKey): string => `--radius-${k}`
const shadowMemphisKey = (k: ShadowMemphisKey): string =>
  k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
// shadowSoftKey reserved for future soft-shadow iteration helpers
// const _shadowSoftKey = (k: 'sm' | 'md' | 'lg'): string => `--shadow-${k}`
const durationKey = (k: MotionDurationKey): string => `--duration-${k}`
const easingKey = (k: MotionEasingKey): string => `--ease-${k}`

// Convert a camelCase semantic key to CSS kebab: cardForeground → card-foreground
const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

function emitRawPalette(palette: RawPalette, lines: string[]): void {
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    lines.push(`  --plum-${step}: ${palette.plum[step]};`)
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    lines.push(`  --gold-${step}: ${palette.gold[step]};`)
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    lines.push(`  --paper-${step}: ${palette.paper[step]};`)
  }
  lines.push(`  --white: #ffffff;`)
  lines.push(`  --black: #000000;`)
}

function emitSemantic(semantic: SemanticTheme, lines: string[]): void {
  for (const key of Object.keys(semantic) as ReadonlyArray<keyof SemanticTheme>) {
    lines.push(`  --${toKebab(key as string)}: ${semantic[key]};`)
  }
}

/**
 * Emit a `:root` block with raw palette + identity + scales, plus
 * `:root[data-theme='light']` and `:root[data-theme='dark']` blocks for
 * the semantic layer.
 */
export function buildCssExport(theme: Theme): string {
  const lines: string[] = []

  // ─── :root (raw palette + identity + scales) ───
  lines.push(':root {')
  emitRawPalette(theme.palette, lines)
  lines.push('')
  lines.push('  /* Identity — theme-agnostic */')
  MEDAL_RANKS.forEach((rank) => {
    lines.push(`  --medal-${rank}-outer: ${theme.identity.medals[rank].outer};`)
    lines.push(`  --medal-${rank}-inner: ${theme.identity.medals[rank].inner};`)
    lines.push(`  --medal-${rank}-text: ${theme.identity.medals[rank].text};`)
  })
  CHART_KEYS.forEach((k) => {
    lines.push(`  --chart-${k}: ${theme.identity.charts[k]};`)
  })
  lines.push(`  --nav-on-dark-accent: ${theme.identity.navOnDark.accent};`)
  lines.push(`  --nav-on-dark-accent-strong: ${theme.identity.navOnDark.accentStrong};`)
  lines.push(`  --nav-on-dark-foreground: ${theme.identity.navOnDark.foreground};`)
  lines.push(`  --nav-on-dark-foreground-strong: ${theme.identity.navOnDark.foregroundStrong};`)
  lines.push(`  --app-pattern-color-1: ${theme.identity.appPattern.color1};`)
  lines.push(`  --app-pattern-color-2: ${theme.identity.appPattern.color2};`)
  lines.push(`  --app-pattern-color-3: ${theme.identity.appPattern.color3};`)
  lines.push(`  --app-pattern-size: ${theme.identity.appPattern.size}px;`)
  lines.push('')

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
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    lines.push(`  ${shadowMemphisKey(k)}: ${shadowMemphisToCss(theme.shadowMemphis[k])};`)
  })

  // Shadow — soft
  lines.push(`  --shadow-sm: 0 1px 2px rgba(0,0,0,${theme.shadowSoft.sm});`)
  lines.push(`  --shadow-md: 0 2px 8px rgba(0,0,0,${theme.shadowSoft.md});`)
  lines.push(`  --shadow-lg: 0 8px 24px rgba(0,0,0,${theme.shadowSoft.lg});`)

  // Spacing
  SPACING_BASE_PX.forEach(([k, px]) => {
    lines.push(`  --${k}: ${px * theme.spacing.scale}px;`)
  })

  // Motion
  DURATION_KEYS.forEach((k) => {
    lines.push(`  ${durationKey(k)}: ${theme.motion.durations[k]}ms;`)
  })
  EASING_KEYS.forEach((k) => {
    lines.push(`  ${easingKey(k)}: ${theme.motion.easings[k]};`)
  })
  lines.push('}')
  lines.push('')

  // ─── :root[data-theme='light'] — semantic layer ───
  lines.push(":root,")
  lines.push(":root[data-theme='light'] {")
  emitSemantic(theme.semantic.light, lines)
  lines.push('}')
  lines.push('')

  // ─── :root[data-theme='dark'] — semantic layer ───
  lines.push(":root[data-theme='dark'] {")
  emitSemantic(theme.semantic.dark, lines)
  lines.push('}')

  return lines.join('\n')
}

/**
 * JSON export — flat nested structure matching the Theme type.
 */
export function buildJsonExport(theme: Theme): string {
  return JSON.stringify(theme, null, 2)
}

/**
 * Tailwind export — emits the `@theme inline` block with --color-*
 * bridges for semantic tokens only (matches theme.css in the lib).
 */
export function buildTailwindExport(theme: Theme): string {
  const lines: string[] = [
    "@import 'tailwindcss';",
    '',
    '@theme inline {',
  ]

  const semanticKeys = Object.keys(theme.semantic.light) as ReadonlyArray<keyof SemanticTheme>
  semanticKeys.forEach((k) => {
    const cssName = toKebab(k as string)
    lines.push(`  --color-${cssName}: var(--${cssName});`)
  })

  // Charts (also exposed as utilities)
  CHART_KEYS.forEach((k) => {
    lines.push(`  --color-chart-${k}: var(--chart-${k});`)
  })

  // Memphis aliases for the Tailwind class shortcuts
  lines.push(`  --color-memphis: var(--memphis-border-color);`)
  lines.push(`  --color-memphis-shadow: var(--memphis-shadow-color);`)

  // Typography, radius, shadow, spacing, motion, z-index — same as theme.css
  lines.push(`  --font-display: var(--font-display);`)
  lines.push(`  --font-body: var(--font-body);`)
  lines.push(`  --font-mono: var(--font-mono);`)

  RADIUS_KEYS.forEach((k) => {
    lines.push(`  ${radiusKey(k)}: var(${radiusKey(k)});`)
  })
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    lines.push(`  ${shadowMemphisKey(k)}: var(${shadowMemphisKey(k)});`)
  })
  lines.push(`  --shadow-sm: var(--shadow-sm);`)
  lines.push(`  --shadow-md: var(--shadow-md);`)
  lines.push(`  --shadow-lg: var(--shadow-lg);`)
  DURATION_KEYS.forEach((k) => {
    lines.push(`  --animate-duration-${k}: var(--duration-${k});`)
  })
  lines.push(`  --ease-memphis: var(--ease-memphis);`)
  lines.push(`  --ease-out-memphis: var(--ease-out);`)

  lines.push('}')
  return lines.join('\n')
}

/**
 * Figma Tokens Studio export — light and dark token sets.
 */
export function buildFigmaExport(theme: Theme): string {
  const toTokens = (semantic: SemanticTheme) => {
    const colors: Record<string, { value: string; type: 'color' }> = {}
    for (const k of Object.keys(semantic) as ReadonlyArray<keyof SemanticTheme>) {
      colors[toKebab(k as string)] = { value: semantic[k], type: 'color' }
    }
    return { colors }
  }

  return JSON.stringify(
    {
      light: toTokens(theme.semantic.light),
      dark: toTokens(theme.semantic.dark),
    },
    null,
    2,
  )
}
