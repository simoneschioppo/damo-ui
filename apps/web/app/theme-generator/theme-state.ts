/**
 * Theme generator — core types + canonical defaults.
 *
 * Models the three-layer architecture from
 * docs/specs/2026-04-24-theme-architecture-refactor-design.md:
 *   Layer 1 — raw palette (ink/brand/paper scales, per-mode light/dark)
 *   Layer 2 — semantic (paired bg+fg, separate light/dark values)
 *   Layer 3 — identity (medals, charts, nav-on-dark, per-mode light/dark)
 * plus typography / radius / shadow / spacing / motion scales.
 *
 * Palette and Identity are now split into light/dark variants — the user
 * can customise per-mode the same way the semantic layer is customised.
 *
 * All nested objects are treated as immutable — the reducer returns new
 * copies on every update.
 */

export type ThemeMode = 'light' | 'dark'

export type TypographySizeKey = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
export type RadiusKey = 'none' | 'sm' | 'md' | 'lg' | 'pill' | 'full'
export type ShadowMemphisKey = 'sm' | 'md' | 'lg' | 'hover' | 'active'
export type ShadowSoftKey = 'sm' | 'md' | 'lg'
export type MotionDurationKey = 'snap' | 'fast' | 'base' | 'slow'
export type MotionEasingKey = 'memphis' | 'out' | 'in-out'

export type MedalRank = 'bronze' | 'silver' | 'gold' | 'master' | 'grandmaster'

export interface ShadowMemphisValue {
  x: number
  y: number
  color: string
}

// ─── Layer 1: Raw palette ────────────────────────────────────

export interface RawPalette {
  readonly ink: Readonly<Record<'100' | '300' | '500' | '700' | '800' | '900', string>>
  readonly brand: Readonly<Record<'100' | '200' | '300' | '400' | '500', string>>
  readonly paper: Readonly<Record<'50' | '100' | '200' | '300', string>>
}

// ─── Layer 2: Semantic (paired bg+fg) ────────────────────────

export interface SemanticTheme {
  readonly background: string
  readonly foreground: string
  readonly card: string
  readonly cardForeground: string
  readonly popover: string
  readonly popoverForeground: string
  readonly muted: string
  readonly mutedForeground: string

  readonly primary: string
  readonly primaryForeground: string
  readonly secondary: string
  readonly secondaryForeground: string
  readonly accent: string
  readonly accentForeground: string
  readonly destructive: string
  readonly destructiveForeground: string

  readonly success: string
  readonly successForeground: string
  readonly warning: string
  readonly warningForeground: string
  readonly info: string
  readonly infoForeground: string
  readonly rage: string
  readonly rageForeground: string

  readonly border: string
  readonly borderStrong: string
  readonly input: string
  readonly ring: string

  readonly memphisShadowColor: string
  readonly memphisBorderColor: string

  readonly badgeFeatured: string
  readonly badgeFeaturedForeground: string
  readonly badgeCopper: string
  readonly badgeCopperForeground: string
  readonly badgeNavy: string
  readonly badgeNavyForeground: string
  readonly badgeDraw: string
  readonly badgeDrawForeground: string
  readonly badgeRank: string
  readonly badgeRankForeground: string
}

// ─── Layer 3: Identity ───────────────────────────────────────

export interface MedalTokens {
  readonly outer: string
  readonly inner: string
  readonly text: string
}

export interface IdentityTheme {
  readonly medals: Readonly<Record<MedalRank, MedalTokens>>
  readonly charts: Readonly<Record<'1' | '2' | '3' | '4' | '5', string>>
  readonly navOnDark: {
    readonly accent: string
    readonly accentStrong: string
    readonly foreground: string
    readonly foregroundStrong: string
  }
  readonly appPattern: {
    readonly color1: string
    readonly color2: string
    readonly color3: string
    readonly size: number
  }
}

// ─── Foundations (per-mode) ──────────────────────────────────

export interface TypographyFoundation {
  readonly fontDisplay: string
  readonly fontBody: string
  readonly fontMono: string
  readonly sizes: Readonly<Record<TypographySizeKey, number>>
}

export type RadiusFoundation = Readonly<Record<RadiusKey, number>>
export type ShadowMemphisFoundation = Readonly<Record<ShadowMemphisKey, ShadowMemphisValue>>
export type ShadowSoftFoundation = Readonly<Record<ShadowSoftKey, number>>

export interface SpacingFoundation {
  readonly scale: number
}

export interface MotionFoundation {
  readonly durations: Readonly<Record<MotionDurationKey, number>>
  readonly easings: Readonly<Record<MotionEasingKey, string>>
}

// ─── Full theme ──────────────────────────────────────────────

export interface Theme {
  readonly palette: {
    readonly light: RawPalette
    readonly dark: RawPalette
  }
  readonly semantic: {
    readonly light: SemanticTheme
    readonly dark: SemanticTheme
  }
  readonly identity: {
    readonly light: IdentityTheme
    readonly dark: IdentityTheme
  }
  readonly typography: {
    readonly light: TypographyFoundation
    readonly dark: TypographyFoundation
  }
  readonly radius: {
    readonly light: RadiusFoundation
    readonly dark: RadiusFoundation
  }
  readonly shadowMemphis: {
    readonly light: ShadowMemphisFoundation
    readonly dark: ShadowMemphisFoundation
  }
  readonly shadowSoft: {
    readonly light: ShadowSoftFoundation
    readonly dark: ShadowSoftFoundation
  }
  readonly spacing: {
    readonly light: SpacingFoundation
    readonly dark: SpacingFoundation
  }
  readonly motion: {
    readonly light: MotionFoundation
    readonly dark: MotionFoundation
  }
}

// ─── Iteration helpers ───────────────────────────────────────

export const PALETTE_STEPS = {
  ink: ['100', '300', '500', '700', '800', '900'] as const,
  brand: ['100', '200', '300', '400', '500'] as const,
  paper: ['50', '100', '200', '300'] as const,
}

export const SEMANTIC_GROUPS = {
  surfaces: [
    { bg: 'background', fg: 'foreground', label: 'Background' },
    { bg: 'card', fg: 'cardForeground', label: 'Card' },
    { bg: 'popover', fg: 'popoverForeground', label: 'Popover' },
    { bg: 'muted', fg: 'mutedForeground', label: 'Muted' },
  ],
  intents: [
    { bg: 'primary', fg: 'primaryForeground', label: 'Primary' },
    { bg: 'secondary', fg: 'secondaryForeground', label: 'Secondary' },
    { bg: 'accent', fg: 'accentForeground', label: 'Accent' },
    { bg: 'destructive', fg: 'destructiveForeground', label: 'Destructive' },
  ],
  statuses: [
    { bg: 'success', fg: 'successForeground', label: 'Success' },
    { bg: 'warning', fg: 'warningForeground', label: 'Warning' },
    { bg: 'info', fg: 'infoForeground', label: 'Info' },
    { bg: 'rage', fg: 'rageForeground', label: 'Rage' },
  ],
  chrome: [
    { key: 'border', label: 'Border' },
    { key: 'borderStrong', label: 'Border strong' },
    { key: 'input', label: 'Input border' },
    { key: 'ring', label: 'Focus ring' },
  ],
  memphis: [
    { key: 'memphisShadowColor', label: 'Shadow' },
    { key: 'memphisBorderColor', label: 'Border' },
  ],
  badges: [
    { bg: 'badgeFeatured', fg: 'badgeFeaturedForeground', label: 'Featured' },
    { bg: 'badgeCopper', fg: 'badgeCopperForeground', label: 'Copper' },
    { bg: 'badgeNavy', fg: 'badgeNavyForeground', label: 'Navy' },
    { bg: 'badgeDraw', fg: 'badgeDrawForeground', label: 'Draw' },
    { bg: 'badgeRank', fg: 'badgeRankForeground', label: 'Rank' },
  ],
} as const

// ─── Semantic derivation helpers ─────────────────────────────
//
// These mirror the cascade in apps/web/app/styles/theme.css.
// They let the generator keep semantic values in sync when the user
// switches presets — instead of staying frozen at plum-gold hex.

export function computeSemanticLight(p: RawPalette): SemanticTheme {
  return {
    background: p.paper['50'],
    foreground: p.ink['900'],
    card: '#ffffff',
    cardForeground: p.ink['900'],
    popover: '#ffffff',
    popoverForeground: p.ink['900'],
    muted: p.paper['100'],
    mutedForeground: p.ink['700'],

    primary: p.brand['500'],
    primaryForeground: '#ffffff',
    secondary: p.ink['500'],
    secondaryForeground: p.paper['50'],
    accent: p.brand['100'],
    accentForeground: p.ink['900'],
    destructive: '#a13a2c',
    destructiveForeground: p.paper['50'],

    success: '#4f8a3c',
    successForeground: p.paper['50'],
    warning: '#8a6326',
    warningForeground: p.paper['50'],
    info: p.ink['500'],
    infoForeground: p.paper['50'],
    rage: '#c94a2f',
    rageForeground: p.paper['50'],

    border: p.ink['900'] + '1f',
    borderStrong: p.ink['900'] + '38',
    input: p.ink['900'] + '1f',
    ring: p.brand['500'],

    memphisShadowColor: '#000000',
    memphisBorderColor: '#000000',

    badgeFeatured: p.brand['500'],
    badgeFeaturedForeground: '#000000',
    badgeCopper: p.brand['500'],
    badgeCopperForeground: '#ffffff',
    badgeNavy: p.ink['900'],
    badgeNavyForeground: p.brand['200'],
    badgeDraw: p.paper['100'],
    badgeDrawForeground: p.ink['900'],
    badgeRank: p.brand['100'],
    badgeRankForeground: p.ink['900'],
  }
}

export function computeSemanticDark(p: RawPalette): SemanticTheme {
  return {
    background: p.ink['900'],
    foreground: p.paper['50'],
    card: p.ink['800'],
    cardForeground: p.paper['50'],
    popover: p.ink['800'],
    popoverForeground: p.paper['50'],
    muted: p.ink['700'],
    mutedForeground: p.ink['300'],

    primary: p.brand['500'],
    primaryForeground: p.ink['900'],
    secondary: p.ink['500'],
    secondaryForeground: p.paper['50'],
    accent: p.ink['700'],
    accentForeground: p.brand['200'],
    destructive: '#c94a2f',
    destructiveForeground: p.paper['50'],

    success: '#6fa85c',
    successForeground: p.ink['900'],
    warning: p.brand['500'],
    warningForeground: p.ink['900'],
    info: p.ink['300'],
    infoForeground: p.ink['900'],
    rage: '#e06b4f',
    rageForeground: p.ink['900'],

    border: p.paper['50'] + '1f',
    borderStrong: p.paper['50'] + '38',
    input: p.paper['50'] + '1f',
    ring: p.brand['500'],

    memphisShadowColor: p.paper['50'],
    memphisBorderColor: p.paper['50'],

    badgeFeatured: p.brand['500'],
    badgeFeaturedForeground: p.ink['900'],
    badgeCopper: p.brand['500'],
    badgeCopperForeground: p.paper['50'],
    badgeNavy: p.ink['700'],
    badgeNavyForeground: p.brand['200'],
    badgeDraw: p.ink['700'],
    badgeDrawForeground: p.paper['50'],
    badgeRank: p.ink['700'],
    badgeRankForeground: p.brand['200'],
  }
}

// ─── Canonical default values ────────────────────────────────

const DEFAULT_PALETTE: RawPalette = {
  ink: {
    '100': '#e0c6e2',
    '300': '#c590c9',
    '500': '#7a3980',
    '700': '#522357',
    '800': '#3d1a40',
    '900': '#2a0f2d',
  },
  brand: {
    '100': '#f8e5bc',
    '200': '#f0d49a',
    '300': '#e5bc6d',
    '400': '#d5a845',
    '500': '#c4942a',
  },
  paper: {
    '50': '#fbf7ee',
    '100': '#f5efde',
    '200': '#ece2c6',
    '300': '#ddd0ae',
  },
}

const DEFAULT_IDENTITY: IdentityTheme = {
  medals: {
    bronze: { outer: '#5a3f20', inner: '#8a6236', text: '#ffffff' },
    silver: { outer: '#4a4a55', inner: '#8a8a9a', text: '#ffffff' },
    gold: { outer: '#2a0f2d', inner: '#c4942a', text: '#2a0f2d' },
    master: { outer: '#2a0f2d', inner: '#7a3980', text: '#fbf7ee' },
    grandmaster: { outer: '#000000', inner: '#c4942a', text: '#2a0f2d' },
  },
  charts: { '1': '#7a3980', '2': '#c4942a', '3': '#4f8a3c', '4': '#a13a2c', '5': '#522357' },
  navOnDark: {
    accent: '#f0d49a',
    accentStrong: '#d5a845',
    foreground: 'rgba(255, 255, 255, 0.72)',
    foregroundStrong: '#ffffff',
  },
  appPattern: { color1: '#c4942a', color2: '#7a3980', color3: '#522357', size: 140 },
}

const DEFAULT_TYPOGRAPHY: TypographyFoundation = {
  fontDisplay: "'Audiowide', system-ui, sans-serif",
  fontBody: "'Exo 2', system-ui, sans-serif",
  fontMono: "'Exo 2', ui-monospace, monospace",
  sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
}

const DEFAULT_RADIUS: RadiusFoundation = { none: 0, sm: 2, md: 4, lg: 8, pill: 999, full: 50 }

const DEFAULT_SHADOW_MEMPHIS: ShadowMemphisFoundation = {
  sm: { x: 3, y: 3, color: '#000000' },
  md: { x: 6, y: 6, color: '#000000' },
  lg: { x: 9, y: 9, color: '#000000' },
  hover: { x: 7, y: 7, color: '#000000' },
  active: { x: 2, y: 2, color: '#000000' },
}

const DEFAULT_SHADOW_SOFT: ShadowSoftFoundation = { sm: 0.06, md: 0.08, lg: 0.12 }

const DEFAULT_SPACING: SpacingFoundation = { scale: 1 }

const DEFAULT_MOTION: MotionFoundation = {
  durations: { snap: 80, fast: 150, base: 200, slow: 300 },
  easings: {
    memphis: 'cubic-bezier(0.4, 1.3, 0.5, 1)',
    out: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export const DEFAULT_THEME: Theme = {
  palette: { light: DEFAULT_PALETTE, dark: DEFAULT_PALETTE },
  semantic: {
    light: computeSemanticLight(DEFAULT_PALETTE),
    dark: computeSemanticDark(DEFAULT_PALETTE),
  },
  identity: { light: DEFAULT_IDENTITY, dark: DEFAULT_IDENTITY },
  typography: { light: DEFAULT_TYPOGRAPHY, dark: DEFAULT_TYPOGRAPHY },
  radius: { light: DEFAULT_RADIUS, dark: DEFAULT_RADIUS },
  shadowMemphis: { light: DEFAULT_SHADOW_MEMPHIS, dark: DEFAULT_SHADOW_MEMPHIS },
  shadowSoft: { light: DEFAULT_SHADOW_SOFT, dark: DEFAULT_SHADOW_SOFT },
  spacing: { light: DEFAULT_SPACING, dark: DEFAULT_SPACING },
  motion: { light: DEFAULT_MOTION, dark: DEFAULT_MOTION },
} as const

/**
 * The base spacing scale multiplier affects every `--space-N` token.
 * These are the raw (pre-scale) values in px.
 */
export const SPACING_BASE_PX: ReadonlyArray<readonly [string, number]> = [
  ['space-0', 0],
  ['space-1', 4],
  ['space-2', 8],
  ['space-3', 12],
  ['space-4', 16],
  ['space-5', 20],
  ['space-6', 24],
  ['space-8', 32],
  ['space-10', 40],
  ['space-12', 48],
  ['space-16', 64],
  ['space-20', 80],
]
