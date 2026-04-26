/**
 * Theme exporters — pure functions that serialise a `Theme` into one of
 * the three download formats surfaced in the UI.
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

// ─── Include flags ───────────────────────────────────────────

export interface IncludeFlags {
  rawPalette: boolean
  semanticLight: boolean
  semanticDark: boolean
  identity: boolean
  foundations: boolean
}

const ALL_FLAGS_TRUE: IncludeFlags = {
  rawPalette: true,
  semanticLight: true,
  semanticDark: true,
  identity: true,
  foundations: true,
}

// ─── Key arrays ──────────────────────────────────────────────

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = [
  'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl',
]
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = ['sm', 'md', 'lg', 'hover', 'active']
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_KEYS: ReadonlyArray<MotionEasingKey> = ['memphis', 'out', 'in-out']
const MEDAL_RANKS: ReadonlyArray<MedalRank> = ['bronze', 'silver', 'gold', 'master', 'grandmaster']

const CHART_KEYS = ['1', '2', '3', '4', '5'] as const

// ─── Helpers ─────────────────────────────────────────────────

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
const durationKey = (k: MotionDurationKey): string => `--duration-${k}`
const easingKey = (k: MotionEasingKey): string => `--ease-${k}`

// Convert a camelCase semantic key to CSS kebab: cardForeground → card-foreground
const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

// ─── Emit helpers ─────────────────────────────────────────────

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

function emitIdentity(theme: Theme, lines: string[]): void {
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
}

function emitFoundations(theme: Theme, lines: string[]): void {
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

  // Border widths
  lines.push(`  /* Border widths */`)
  lines.push(`  --border-thin: 1px;`)
  lines.push(`  --border-base: 2px;`)
  lines.push(`  --border-thick: 3px;`)

  // Z-index
  lines.push(`  /* Z-index */`)
  lines.push(`  --z-base: 0;`)
  lines.push(`  --z-sticky: 100;`)
  lines.push(`  --z-header: 200;`)
  lines.push(`  --z-dropdown: 300;`)
  lines.push(`  --z-overlay: 400;`)
  lines.push(`  --z-modal: 500;`)
  lines.push(`  --z-toast: 600;`)
  lines.push(`  --z-tooltip: 700;`)

  // Chrome geometry
  lines.push(`  --header-height: 56px;`)
}

// ─── CSS export ──────────────────────────────────────────────

/**
 * Emit a `:root` block with raw palette + identity + scales, plus
 * `:root[data-theme='light']` and `:root[data-theme='dark']` blocks for
 * the semantic layer.
 *
 * Accepts optional `flags` to filter output sections. Defaults to all-on.
 */
export function buildCssExport(theme: Theme, flags: IncludeFlags = ALL_FLAGS_TRUE): string {
  const segments: string[] = []

  // ─── :root block (raw palette + identity + foundations) ───
  const rootLines: string[] = []
  if (flags.rawPalette) {
    emitRawPalette(theme.palette, rootLines)
  }
  if (flags.identity) {
    if (rootLines.length > 0) rootLines.push('')
    rootLines.push('  /* Identity — theme-agnostic */')
    emitIdentity(theme, rootLines)
  }
  if (flags.foundations) {
    if (rootLines.length > 0) rootLines.push('')
    rootLines.push('  /* Foundations */')
    emitFoundations(theme, rootLines)
  }

  if (rootLines.length > 0) {
    segments.push(':root {')
    segments.push(...rootLines)
    segments.push('}')
  }

  // ─── :root[data-theme='light'] block ───
  if (flags.semanticLight) {
    const block: string[] = []
    block.push(":root,")
    block.push(":root[data-theme='light'] {")
    emitSemantic(theme.semantic.light, block)
    block.push('}')
    segments.push(block.join('\n'))
  }

  // ─── :root[data-theme='dark'] block ───
  if (flags.semanticDark) {
    const block: string[] = []
    block.push(":root[data-theme='dark'] {")
    emitSemantic(theme.semantic.dark, block)
    block.push('}')
    segments.push(block.join('\n'))
  }

  return segments.join('\n\n')
}

// ─── JSON export ─────────────────────────────────────────────

/**
 * JSON export — flat nested structure matching the Theme type.
 */
export function buildJsonExport(theme: Theme): string {
  return JSON.stringify(theme, null, 2)
}

// ─── Tailwind export ─────────────────────────────────────────

/**
 * Tailwind export — emits the `@theme inline` block with --color-*
 * bridges for semantic tokens only (matches theme.css in the lib).
 *
 * Accepts optional `flags` to filter output sections. Defaults to all-on.
 */
export function buildTailwindExport(theme: Theme, flags: IncludeFlags = ALL_FLAGS_TRUE): string {
  const inner: string[] = []

  // Semantic colors
  if (flags.semanticLight) {
    const semanticKeys = Object.keys(theme.semantic.light) as ReadonlyArray<keyof SemanticTheme>
    semanticKeys.forEach((k) => {
      const cssName = toKebab(k as string)
      inner.push(`  --color-${cssName}: var(--${cssName});`)
    })
  }

  // Identity: charts + memphis aliases
  if (flags.identity) {
    CHART_KEYS.forEach((k) => {
      inner.push(`  --color-chart-${k}: var(--chart-${k});`)
    })
    inner.push(`  --color-memphis: var(--memphis-border-color);`)
    inner.push(`  --color-memphis-shadow: var(--memphis-shadow-color);`)
  }

  // Foundations: typography, radius, shadow, spacing, motion, z-index, borders
  if (flags.foundations) {
    // Typography: fonts
    inner.push(`  --font-display: var(--font-display);`)
    inner.push(`  --font-body: var(--font-body);`)
    inner.push(`  --font-mono: var(--font-mono);`)

    // Typography: text sizes
    SIZE_KEYS.forEach((k) => {
      inner.push(`  ${sizeKey(k)}: var(${sizeKey(k)});`)
    })

    // Radius
    RADIUS_KEYS.forEach((k) => {
      inner.push(`  ${radiusKey(k)}: var(${radiusKey(k)});`)
    })

    // Shadow — memphis
    SHADOW_MEMPHIS_KEYS.forEach((k) => {
      inner.push(`  ${shadowMemphisKey(k)}: var(${shadowMemphisKey(k)});`)
    })

    // Shadow — soft
    inner.push(`  --shadow-sm: var(--shadow-sm);`)
    inner.push(`  --shadow-md: var(--shadow-md);`)
    inner.push(`  --shadow-lg: var(--shadow-lg);`)

    // Spacing — Tailwind v4 foundational unit + explicit spacing tokens
    inner.push(`  --spacing: calc(0.25rem * var(--density-scale-y));`)
    SPACING_BASE_PX.forEach(([k]) => {
      inner.push(`  --${k}: var(--${k});`)
    })

    // Motion
    DURATION_KEYS.forEach((k) => {
      inner.push(`  --animate-duration-${k}: var(${durationKey(k)});`)
    })
    inner.push(`  --ease-memphis: var(--ease-memphis);`)
    inner.push(`  --ease-out-memphis: var(--ease-out);`)
    inner.push(`  --ease-in-out: var(--ease-in-out);`)

    // Z-index
    const Z_KEYS = ['base', 'sticky', 'header', 'dropdown', 'overlay', 'modal', 'toast', 'tooltip'] as const
    Z_KEYS.forEach((k) => {
      inner.push(`  --z-index-${k}: var(--z-${k});`)
    })

    // Border widths
    inner.push(`  --border-width-thin: var(--border-thin);`)
    inner.push(`  --border-width-base: var(--border-base);`)
    inner.push(`  --border-width-thick: var(--border-thick);`)
  }

  const lines: string[] = [
    "@import 'tailwindcss';",
    '',
    '@theme inline {',
    ...inner,
    '}',
  ]

  return lines.join('\n')
}
