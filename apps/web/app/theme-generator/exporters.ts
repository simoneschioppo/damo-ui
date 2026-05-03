/**
 * Theme exporters — pure functions that serialise a `Theme` into one of
 * the three download formats surfaced in the UI.
 *
 * All functions are side-effect free (no DOM access, no I/O).
 *
 * Layout of the CSS export:
 *   - `:root` — light palette + light identity + foundations
 *   - `:root,:root[data-theme='light']` — light semantic
 *   - `:root[data-theme='dark']` — dark semantic (full) plus delta-encoded
 *     palette/identity overrides (only tokens that differ from light).
 *
 * Note: semantic tokens are always emitted in full in both light and dark
 * blocks because the semantic layer is expected to fully override per
 * theme. Palette and identity, by contrast, are typically shared between
 * modes — so emitting only the diff keeps output tight.
 */

import {
  type Theme,
  type SemanticTheme,
  type RawPalette,
  type IdentityTheme,
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

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = ['sm', 'md', 'lg', 'hover', 'active']
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_KEYS: ReadonlyArray<MotionEasingKey> = ['memphis', 'out', 'in-out']
const MEDAL_RANKS: ReadonlyArray<MedalRank> = ['bronze', 'silver', 'gold', 'master', 'grandmaster']

const CHART_KEYS = ['1', '2', '3', '4', '5'] as const

// ─── Tailwind semantic excludes ──────────────────────────────
const TAILWIND_SEMANTIC_EXCLUDES = new Set(['memphisShadowColor', 'memphisBorderColor'])

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

interface PaletteLineSpec {
  cssVar: string
  value: string
}

function paletteLines(palette: RawPalette): PaletteLineSpec[] {
  const out: PaletteLineSpec[] = []
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    out.push({ cssVar: `--ink-${step}`, value: palette.ink[step] })
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    out.push({ cssVar: `--brand-${step}`, value: palette.brand[step] })
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    out.push({ cssVar: `--paper-${step}`, value: palette.paper[step] })
  }
  return out
}

function identityLines(identity: IdentityTheme): PaletteLineSpec[] {
  const out: PaletteLineSpec[] = []
  MEDAL_RANKS.forEach((rank) => {
    out.push({ cssVar: `--medal-${rank}-outer`, value: identity.medals[rank].outer })
    out.push({ cssVar: `--medal-${rank}-inner`, value: identity.medals[rank].inner })
    out.push({ cssVar: `--medal-${rank}-text`, value: identity.medals[rank].text })
  })
  CHART_KEYS.forEach((k) => {
    out.push({ cssVar: `--chart-${k}`, value: identity.charts[k] })
  })
  out.push({ cssVar: `--nav-on-dark-accent`, value: identity.navOnDark.accent })
  out.push({ cssVar: `--nav-on-dark-accent-strong`, value: identity.navOnDark.accentStrong })
  out.push({ cssVar: `--nav-on-dark-foreground`, value: identity.navOnDark.foreground })
  out.push({
    cssVar: `--nav-on-dark-foreground-strong`,
    value: identity.navOnDark.foregroundStrong,
  })
  out.push({ cssVar: `--app-pattern-color-1`, value: identity.appPattern.color1 })
  out.push({ cssVar: `--app-pattern-color-2`, value: identity.appPattern.color2 })
  out.push({ cssVar: `--app-pattern-color-3`, value: identity.appPattern.color3 })
  out.push({ cssVar: `--app-pattern-size`, value: `${identity.appPattern.size}px` })
  return out
}

function emitPalette(palette: RawPalette, lines: string[]): void {
  paletteLines(palette).forEach(({ cssVar, value }) => {
    lines.push(`  ${cssVar}: ${value};`)
  })
  lines.push(`  --white: #ffffff;`)
  lines.push(`  --black: #000000;`)
}

function emitSemantic(semantic: SemanticTheme, lines: string[]): void {
  for (const key of Object.keys(semantic) as ReadonlyArray<keyof SemanticTheme>) {
    lines.push(`  --${toKebab(key as string)}: ${semantic[key]};`)
  }
}

function emitIdentity(identity: IdentityTheme, lines: string[]): void {
  identityLines(identity).forEach(({ cssVar, value }) => {
    lines.push(`  ${cssVar}: ${value};`)
  })
}

/**
 * Emit lines from `darkLines` that differ from `lightLines` by cssVar key.
 * Tokens identical in both modes are not duplicated in the dark block.
 */
function emitDeltaDark(
  lightLines: PaletteLineSpec[],
  darkLines: PaletteLineSpec[],
  out: string[],
): void {
  const lightMap = new Map(lightLines.map((l) => [l.cssVar, l.value]))
  for (const { cssVar, value } of darkLines) {
    if (lightMap.get(cssVar) !== value) {
      out.push(`  ${cssVar}: ${value};`)
    }
  }
}

type ThemeMode = 'light' | 'dark'

/**
 * Per-mode foundation lines (the parts that can diverge between light and
 * dark): typography, radius, shadowMemphis, shadowSoft, spacing, motion.
 * Used both for full emission (light block) and for delta-encoded
 * emission in the dark block.
 */
function foundationLines(theme: Theme, mode: ThemeMode): PaletteLineSpec[] {
  const out: PaletteLineSpec[] = []
  const t = theme.typography[mode]
  out.push({ cssVar: '--font-display', value: t.fontDisplay })
  out.push({ cssVar: '--font-body', value: t.fontBody })
  out.push({ cssVar: '--font-mono', value: t.fontMono })
  SIZE_KEYS.forEach((k) => {
    out.push({ cssVar: sizeKey(k), value: `${t.sizes[k]}px` })
  })
  const r = theme.radius[mode]
  RADIUS_KEYS.forEach((k) => {
    out.push({ cssVar: radiusKey(k), value: radiusToCss(k, r[k]) })
  })
  const sm = theme.shadowMemphis[mode]
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    out.push({ cssVar: shadowMemphisKey(k), value: shadowMemphisToCss(sm[k]) })
  })
  const ss = theme.shadowSoft[mode]
  out.push({ cssVar: '--shadow-sm', value: `0 1px 2px rgba(0,0,0,${ss.sm})` })
  out.push({ cssVar: '--shadow-md', value: `0 2px 8px rgba(0,0,0,${ss.md})` })
  out.push({ cssVar: '--shadow-lg', value: `0 8px 24px rgba(0,0,0,${ss.lg})` })
  const sp = theme.spacing[mode]
  SPACING_BASE_PX.forEach(([k, px]) => {
    out.push({ cssVar: `--${k}`, value: `${px * sp.scale}px` })
  })
  const m = theme.motion[mode]
  DURATION_KEYS.forEach((k) => {
    out.push({ cssVar: durationKey(k), value: `${m.durations[k]}ms` })
  })
  EASING_KEYS.forEach((k) => {
    out.push({ cssVar: easingKey(k), value: m.easings[k] })
  })
  return out
}

function emitFoundationsLight(theme: Theme, lines: string[]): void {
  foundationLines(theme, 'light').forEach(({ cssVar, value }) => {
    lines.push(`  ${cssVar}: ${value};`)
  })

  // Static (mode-agnostic) tokens — emitted only once in the light block
  lines.push(`  /* Border widths */`)
  lines.push(`  --border-thin: 1px;`)
  lines.push(`  --border-base: 2px;`)
  lines.push(`  --border-thick: 3px;`)

  lines.push(`  /* Z-index */`)
  lines.push(`  --z-base: 0;`)
  lines.push(`  --z-sticky: 100;`)
  lines.push(`  --z-header: 200;`)
  lines.push(`  --z-dropdown: 300;`)
  lines.push(`  --z-overlay: 400;`)
  lines.push(`  --z-modal: 500;`)
  lines.push(`  --z-toast: 600;`)
  lines.push(`  --z-tooltip: 700;`)

  lines.push(`  --header-height: 56px;`)
}

// ─── CSS export ──────────────────────────────────────────────

/**
 * Emit a `:root` block with light raw palette + light identity + foundations,
 * a `:root,:root[data-theme='light']` block with light semantic, and a
 * `:root[data-theme='dark']` block containing dark palette / identity /
 * semantic deltas.
 */
export function buildCssExport(theme: Theme, flags: IncludeFlags = ALL_FLAGS_TRUE): string {
  const segments: string[] = []

  // ─── :root block (light palette + light identity + foundations) ───
  const rootLines: string[] = []
  if (flags.rawPalette) {
    emitPalette(theme.palette.light, rootLines)
  }
  if (flags.identity) {
    if (rootLines.length > 0) rootLines.push('')
    rootLines.push('  /* Identity — light */')
    emitIdentity(theme.identity.light, rootLines)
  }
  if (flags.foundations) {
    if (rootLines.length > 0) rootLines.push('')
    rootLines.push('  /* Foundations — light */')
    emitFoundationsLight(theme, rootLines)
  }

  if (rootLines.length > 0) {
    segments.push([':root {', ...rootLines, '}'].join('\n'))
  }

  // ─── :root[data-theme='light'] block (semantic — light) ───
  if (flags.semanticLight) {
    const block: string[] = []
    block.push(':root,')
    block.push(":root[data-theme='light'] {")
    emitSemantic(theme.semantic.light, block)
    block.push('}')
    segments.push(block.join('\n'))
  }

  // ─── :root[data-theme='dark'] block (palette + identity + semantic + foundations deltas) ───
  const darkBlockLines: string[] = []
  if (flags.rawPalette) {
    emitDeltaDark(
      paletteLines(theme.palette.light),
      paletteLines(theme.palette.dark),
      darkBlockLines,
    )
  }
  if (flags.identity) {
    const identityDark: string[] = []
    emitDeltaDark(
      identityLines(theme.identity.light),
      identityLines(theme.identity.dark),
      identityDark,
    )
    if (identityDark.length > 0) {
      if (darkBlockLines.length > 0) darkBlockLines.push('')
      darkBlockLines.push('  /* Identity — dark */')
      darkBlockLines.push(...identityDark)
    }
  }
  if (flags.foundations) {
    const foundationsDark: string[] = []
    emitDeltaDark(foundationLines(theme, 'light'), foundationLines(theme, 'dark'), foundationsDark)
    if (foundationsDark.length > 0) {
      if (darkBlockLines.length > 0) darkBlockLines.push('')
      darkBlockLines.push('  /* Foundations — dark */')
      darkBlockLines.push(...foundationsDark)
    }
  }
  if (flags.semanticDark) {
    if (darkBlockLines.length > 0) darkBlockLines.push('')
    emitSemantic(theme.semantic.dark, darkBlockLines)
  }

  if (darkBlockLines.length > 0) {
    segments.push([":root[data-theme='dark'] {", ...darkBlockLines, '}'].join('\n'))
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
 */
export function buildTailwindExport(theme: Theme, flags: IncludeFlags = ALL_FLAGS_TRUE): string {
  const inner: string[] = []

  // Semantic colors (excluding memphis bridges emitted separately in identity block)
  if (flags.semanticLight) {
    const semanticKeys = (Object.keys(theme.semantic.light) as Array<keyof SemanticTheme>).filter(
      (k) => !TAILWIND_SEMANTIC_EXCLUDES.has(k as string),
    )
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
    inner.push(`  --font-display: var(--font-display);`)
    inner.push(`  --font-body: var(--font-body);`)
    inner.push(`  --font-mono: var(--font-mono);`)

    SIZE_KEYS.forEach((k) => {
      inner.push(`  ${sizeKey(k)}: var(${sizeKey(k)});`)
    })

    RADIUS_KEYS.forEach((k) => {
      inner.push(`  ${radiusKey(k)}: var(${radiusKey(k)});`)
    })

    SHADOW_MEMPHIS_KEYS.forEach((k) => {
      inner.push(`  ${shadowMemphisKey(k)}: var(${shadowMemphisKey(k)});`)
    })

    inner.push(`  --shadow-sm: var(--shadow-sm);`)
    inner.push(`  --shadow-md: var(--shadow-md);`)
    inner.push(`  --shadow-lg: var(--shadow-lg);`)

    inner.push(`  --spacing: calc(0.25rem * var(--density-scale-y));`)
    SPACING_BASE_PX.forEach(([k]) => {
      inner.push(`  --${k}: var(--${k});`)
    })

    DURATION_KEYS.forEach((k) => {
      inner.push(`  --animate-duration-${k}: var(${durationKey(k)});`)
    })
    inner.push(`  --ease-memphis: var(--ease-memphis);`)
    inner.push(`  --ease-out-memphis: var(--ease-out);`)
    inner.push(`  --ease-in-out: var(--ease-in-out);`)

    const Z_KEYS = [
      'base',
      'sticky',
      'header',
      'dropdown',
      'overlay',
      'modal',
      'toast',
      'tooltip',
    ] as const
    Z_KEYS.forEach((k) => {
      inner.push(`  --z-index-${k}: var(--z-${k});`)
    })

    inner.push(`  --border-width-thin: var(--border-thin);`)
    inner.push(`  --border-width-base: var(--border-base);`)
    inner.push(`  --border-width-thick: var(--border-thick);`)
  }

  const lines: string[] = ["@import 'tailwindcss';", '', '@theme inline {', ...inner, '}']

  return lines.join('\n')
}
