/**
 * Theme generator — core types + canonical defaults.
 *
 * Models the three-layer architecture from
 * docs/specs/2026-04-24-theme-architecture-refactor-design.md:
 *   Layer 1 — raw palette (ink/brand/paper scales, per-mode light/dark)
 *   Layer 2 — semantic (paired bg+fg, separate light/dark values)
 *   Layer 3 — identity (medals, charts, nav-on-dark, per-mode light/dark)
 * plus typography / radius / shadow / motion scales.
 *
 * Palette and Identity are now split into light/dark variants — the user
 * can customise per-mode the same way the semantic layer is customised.
 *
 * All nested objects are treated as immutable — the reducer returns new
 * copies on every update.
 */

export type ThemeMode = 'light' | 'dark'

export type TypographySizeKey = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
export type RadiusKey = 'none' | 'sm' | 'md' | 'selection' | 'pill' | 'full'
export type ShadowMemphisKey = 'sm' | 'card' | 'md' | 'lg' | 'hover' | 'active'
export type MotionDurationKey = 'snap' | 'fast' | 'base' | 'slow'
export type MotionEasingKey = 'memphis' | 'out'

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
  readonly destructive: string
  readonly destructiveForeground: string

  readonly success: string
  readonly successForeground: string
  readonly warning: string
  readonly warningForeground: string
  readonly info: string
  readonly infoForeground: string

  readonly border: string
  readonly borderStrong: string
  readonly ring: string

  readonly memphisShadowColor: string
  readonly memphisBorderColor: string

  readonly badgeFeatured: string
  readonly badgeFeaturedForeground: string
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
/** Soft shadow has only a single tier (`md`) — the lib's signature elevation
 *  is the Memphis stack; soft is reserved for tooltips / popovers. */
export interface ShadowSoftFoundation {
  readonly md: number
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
    { bg: 'destructive', fg: 'destructiveForeground', label: 'Destructive' },
  ],
  statuses: [
    { bg: 'success', fg: 'successForeground', label: 'Success' },
    { bg: 'warning', fg: 'warningForeground', label: 'Warning' },
    { bg: 'info', fg: 'infoForeground', label: 'Info' },
  ],
  chrome: [
    { key: 'border', label: 'Border' },
    { key: 'borderStrong', label: 'Border strong' },
    { key: 'ring', label: 'Focus ring' },
  ],
  memphis: [
    { key: 'memphisShadowColor', label: 'Shadow' },
    { key: 'memphisBorderColor', label: 'Border' },
  ],
  badges: [{ bg: 'badgeFeatured', fg: 'badgeFeaturedForeground', label: 'Featured' }],
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
    destructive: '#a13a2c',
    destructiveForeground: p.paper['50'],

    success: '#4f8a3c',
    successForeground: p.paper['50'],
    warning: '#8a6326',
    warningForeground: p.paper['50'],
    info: p.ink['500'],
    infoForeground: p.paper['50'],

    border: p.ink['900'] + '1f',
    borderStrong: p.ink['900'] + '38',
    ring: p.brand['500'],

    memphisShadowColor: '#000000',
    memphisBorderColor: '#000000',

    badgeFeatured: p.brand['500'],
    badgeFeaturedForeground: '#000000',
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
    // gh-91: muted lifts to ink.800 (tighter step from background); muted-foreground
    // collapses to paper.50 by design — full-white text on muted surfaces.
    muted: p.ink['800'],
    mutedForeground: p.paper['50'],

    // gh-91: primary lifts to brand.400 for Memphis tinted-shadow legibility on
    // dark plum (Ghost button); ring + badgeFeatured follow.
    primary: p.brand['400'],
    primaryForeground: p.ink['900'],
    secondary: p.ink['500'],
    secondaryForeground: p.paper['50'],
    destructive: '#c94a2f',
    destructiveForeground: p.paper['50'],

    success: '#6fa85c',
    successForeground: p.ink['900'],
    // gh-91: warning decoupled from primary (was brand.500 = primary) to a custom
    // amber that stays distinct from gold + success + destructive.
    warning: '#e8a435',
    warningForeground: p.ink['900'],
    info: p.ink['300'],
    infoForeground: p.ink['900'],

    border: p.paper['50'] + '1f',
    borderStrong: p.paper['50'] + '38',
    ring: p.brand['400'],

    // gh-91: shadow stays solid black in dark (consistent with foundations).
    // Border lifts to a light gray so the Memphis 2px frame stays visible
    // against the dark plum surfaces — black borders disappeared into bg/card.
    memphisShadowColor: '#000000',
    memphisBorderColor: '#cccccc',

    badgeFeatured: p.brand['400'],
    badgeFeaturedForeground: p.ink['900'],
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

const DEFAULT_IDENTITY_LIGHT: IdentityTheme = {
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

/**
 * gh-91: dark-mode identity diverges from light because several light values
 * collide with `--background = ink.900` (medals.gold.outer, medals.master.outer)
 * or sit too low-contrast against it (charts.1/5, appPattern.color2/3).
 * Bronze, silver, grandmaster medals + navOnDark already work on dark surfaces
 * and stay aligned with the light identity.
 */
const DEFAULT_IDENTITY_DARK: IdentityTheme = {
  medals: {
    bronze: { outer: '#5a3f20', inner: '#8a6236', text: '#ffffff' },
    silver: { outer: '#4a4a55', inner: '#8a8a9a', text: '#ffffff' },
    gold: { outer: '#fbf7ee', inner: '#c4942a', text: '#2a0f2d' },
    master: { outer: '#fbf7ee', inner: '#7a3980', text: '#fbf7ee' },
    grandmaster: { outer: '#000000', inner: '#c4942a', text: '#2a0f2d' },
  },
  charts: { '1': '#c590c9', '2': '#d5a845', '3': '#6fa85c', '4': '#c94a2f', '5': '#e0c6e2' },
  navOnDark: {
    accent: '#f0d49a',
    accentStrong: '#d5a845',
    foreground: 'rgba(255, 255, 255, 0.72)',
    foregroundStrong: '#ffffff',
  },
  appPattern: { color1: '#d5a845', color2: '#c590c9', color3: '#7a3980', size: 140 },
}

const DEFAULT_TYPOGRAPHY: TypographyFoundation = {
  fontDisplay: "'Audiowide', system-ui, sans-serif",
  fontBody: "'Exo 2', system-ui, sans-serif",
  fontMono: "'Exo 2', ui-monospace, monospace",
  sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
}

const DEFAULT_RADIUS: RadiusFoundation = {
  none: 0,
  sm: 2,
  md: 4,
  // `selection` controls the rounding of "selected" chrome on NavItem and
  // DropdownMenuRadioItem. Defaulted to 10px to match the reference design.
  selection: 10,
  pill: 999,
  full: 50,
}

const DEFAULT_SHADOW_MEMPHIS: ShadowMemphisFoundation = {
  sm: { x: 3, y: 3, color: '#000000' },
  card: { x: 4, y: 4, color: '#000000' },
  md: { x: 6, y: 6, color: '#000000' },
  lg: { x: 9, y: 9, color: '#000000' },
  hover: { x: 7, y: 7, color: '#000000' },
  active: { x: 2, y: 2, color: '#000000' },
}

const DEFAULT_SHADOW_SOFT: ShadowSoftFoundation = { md: 0.08 }

const DEFAULT_MOTION: MotionFoundation = {
  durations: { snap: 80, fast: 150, base: 200, slow: 300 },
  easings: {
    memphis: 'cubic-bezier(0.4, 1.3, 0.5, 1)',
    out: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
  },
}

export const DEFAULT_THEME: Theme = {
  palette: { light: DEFAULT_PALETTE, dark: DEFAULT_PALETTE },
  semantic: {
    light: computeSemanticLight(DEFAULT_PALETTE),
    dark: computeSemanticDark(DEFAULT_PALETTE),
  },
  identity: { light: DEFAULT_IDENTITY_LIGHT, dark: DEFAULT_IDENTITY_DARK },
  typography: { light: DEFAULT_TYPOGRAPHY, dark: DEFAULT_TYPOGRAPHY },
  radius: { light: DEFAULT_RADIUS, dark: DEFAULT_RADIUS },
  shadowMemphis: { light: DEFAULT_SHADOW_MEMPHIS, dark: DEFAULT_SHADOW_MEMPHIS },
  shadowSoft: { light: DEFAULT_SHADOW_SOFT, dark: DEFAULT_SHADOW_SOFT },
  motion: { light: DEFAULT_MOTION, dark: DEFAULT_MOTION },
} as const
