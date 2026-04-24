/**
 * Theme generator — core types + canonical defaults.
 *
 * Models the three-layer architecture from
 * docs/specs/2026-04-24-theme-architecture-refactor-design.md:
 *   Layer 1 — raw palette (plum/gold/paper scales, swap per preset)
 *   Layer 2 — semantic (paired bg+fg, separate light/dark values)
 *   Layer 3 — identity (medals, charts, nav-on-dark, theme-agnostic)
 * plus typography / radius / shadow / spacing / motion scales.
 *
 * All nested objects are treated as immutable — the reducer returns new
 * copies on every update.
 */

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
  readonly plum: Readonly<Record<'100' | '300' | '500' | '700' | '800' | '900', string>>
  readonly gold: Readonly<Record<'100' | '200' | '300' | '400' | '500', string>>
  readonly paper: Readonly<Record<'50' | '100' | '200' | '300', string>>
}

// ─── Layer 2: Semantic (paired bg+fg) ────────────────────────

export interface SemanticTheme {
  readonly background: string; readonly foreground: string
  readonly card: string; readonly cardForeground: string
  readonly popover: string; readonly popoverForeground: string
  readonly muted: string; readonly mutedForeground: string

  readonly primary: string; readonly primaryForeground: string
  readonly secondary: string; readonly secondaryForeground: string
  readonly accent: string; readonly accentForeground: string
  readonly destructive: string; readonly destructiveForeground: string

  readonly success: string; readonly successForeground: string
  readonly warning: string; readonly warningForeground: string
  readonly info: string; readonly infoForeground: string
  readonly rage: string; readonly rageForeground: string

  readonly border: string; readonly borderStrong: string
  readonly input: string; readonly ring: string

  readonly memphisShadowColor: string; readonly memphisBorderColor: string

  readonly badgeFeatured: string; readonly badgeFeaturedForeground: string
  readonly badgeCopper: string; readonly badgeCopperForeground: string
  readonly badgeNavy: string; readonly badgeNavyForeground: string
  readonly badgeDraw: string; readonly badgeDrawForeground: string
  readonly badgeRank: string; readonly badgeRankForeground: string
}

// ─── Layer 3: Identity (theme-agnostic) ──────────────────────

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

// ─── Full theme ──────────────────────────────────────────────

export interface Theme {
  readonly palette: RawPalette
  readonly semantic: {
    readonly light: SemanticTheme
    readonly dark: SemanticTheme
  }
  readonly identity: IdentityTheme
  readonly typography: {
    readonly fontDisplay: string
    readonly fontBody: string
    readonly fontMono: string
    readonly sizes: Readonly<Record<TypographySizeKey, number>>
  }
  readonly radius: Readonly<Record<RadiusKey, number>>
  readonly shadowMemphis: Readonly<Record<ShadowMemphisKey, ShadowMemphisValue>>
  readonly shadowSoft: Readonly<Record<ShadowSoftKey, number>>
  readonly spacing: { readonly scale: number }
  readonly motion: {
    readonly durations: Readonly<Record<MotionDurationKey, number>>
    readonly easings: Readonly<Record<MotionEasingKey, string>>
  }
}

// ─── Iteration helpers ───────────────────────────────────────

export const PALETTE_STEPS = {
  plum: ['100', '300', '500', '700', '800', '900'] as const,
  gold: ['100', '200', '300', '400', '500'] as const,
  paper: ['50', '100', '200', '300'] as const,
}

export const SEMANTIC_GROUPS = {
  surfaces: [
    { bg: 'background', fg: 'foreground', label: 'Page background' },
    { bg: 'card', fg: 'cardForeground', label: 'Card' },
    { bg: 'popover', fg: 'popoverForeground', label: 'Popover' },
    { bg: 'muted', fg: 'mutedForeground', label: 'Muted' },
  ],
  intents: [
    { bg: 'primary', fg: 'primaryForeground', label: 'Primary' },
    { bg: 'secondary', fg: 'secondaryForeground', label: 'Secondary' },
    { bg: 'accent', fg: 'accentForeground', label: 'Accent (highlight)' },
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
    { key: 'borderStrong', label: 'Border (strong)' },
    { key: 'input', label: 'Input border' },
    { key: 'ring', label: 'Focus ring' },
  ],
  memphis: [
    { key: 'memphisShadowColor', label: 'Memphis shadow' },
    { key: 'memphisBorderColor', label: 'Memphis border' },
  ],
  badges: [
    { bg: 'badgeFeatured', fg: 'badgeFeaturedForeground', label: 'Badge featured' },
    { bg: 'badgeCopper', fg: 'badgeCopperForeground', label: 'Badge copper' },
    { bg: 'badgeNavy', fg: 'badgeNavyForeground', label: 'Badge navy' },
    { bg: 'badgeDraw', fg: 'badgeDrawForeground', label: 'Badge draw' },
    { bg: 'badgeRank', fg: 'badgeRankForeground', label: 'Badge rank' },
  ],
} as const

// ─── Canonical default values ────────────────────────────────

const LIGHT_SEMANTIC: SemanticTheme = {
  background: '#fbf7ee', foreground: '#2a0f2d',
  card: '#ffffff', cardForeground: '#2a0f2d',
  popover: '#ffffff', popoverForeground: '#2a0f2d',
  muted: '#f5efde', mutedForeground: '#522357',

  primary: '#c4942a', primaryForeground: '#ffffff',
  secondary: '#7a3980', secondaryForeground: '#fbf7ee',
  accent: '#f8e5bc', accentForeground: '#2a0f2d',
  destructive: '#a13a2c', destructiveForeground: '#fbf7ee',

  success: '#4f8a3c', successForeground: '#fbf7ee',
  warning: '#8a6326', warningForeground: '#fbf7ee',
  info: '#7a3980', infoForeground: '#fbf7ee',
  rage: '#c94a2f', rageForeground: '#fbf7ee',

  border: '#2a0f2d1f', borderStrong: '#2a0f2d38',
  input: '#2a0f2d1f', ring: '#c4942a',

  memphisShadowColor: '#000000', memphisBorderColor: '#000000',

  badgeFeatured: '#c4942a', badgeFeaturedForeground: '#000000',
  badgeCopper: '#c4942a', badgeCopperForeground: '#ffffff',
  badgeNavy: '#2a0f2d', badgeNavyForeground: '#f0d49a',
  badgeDraw: '#f5efde', badgeDrawForeground: '#2a0f2d',
  badgeRank: '#f8e5bc', badgeRankForeground: '#2a0f2d',
} as const

const DARK_SEMANTIC: SemanticTheme = {
  background: '#2a0f2d', foreground: '#fbf7ee',
  card: '#3d1a40', cardForeground: '#fbf7ee',
  popover: '#3d1a40', popoverForeground: '#fbf7ee',
  muted: '#522357', mutedForeground: '#c590c9',

  primary: '#c4942a', primaryForeground: '#2a0f2d',
  secondary: '#7a3980', secondaryForeground: '#fbf7ee',
  accent: '#522357', accentForeground: '#f0d49a',
  destructive: '#c94a2f', destructiveForeground: '#fbf7ee',

  success: '#6fa85c', successForeground: '#2a0f2d',
  warning: '#c4942a', warningForeground: '#2a0f2d',
  info: '#c590c9', infoForeground: '#2a0f2d',
  rage: '#e06b4f', rageForeground: '#2a0f2d',

  border: '#fbf7ee1f', borderStrong: '#fbf7ee38',
  input: '#fbf7ee1f', ring: '#c4942a',

  memphisShadowColor: '#fbf7ee', memphisBorderColor: '#fbf7ee',

  badgeFeatured: '#c4942a', badgeFeaturedForeground: '#2a0f2d',
  badgeCopper: '#c4942a', badgeCopperForeground: '#fbf7ee',
  badgeNavy: '#522357', badgeNavyForeground: '#f0d49a',
  badgeDraw: '#522357', badgeDrawForeground: '#fbf7ee',
  badgeRank: '#522357', badgeRankForeground: '#f0d49a',
} as const

export const DEFAULT_THEME: Theme = {
  palette: {
    plum: {
      '100': '#e0c6e2', '300': '#c590c9', '500': '#7a3980',
      '700': '#522357', '800': '#3d1a40', '900': '#2a0f2d',
    },
    gold: {
      '100': '#f8e5bc', '200': '#f0d49a', '300': '#e5bc6d',
      '400': '#d5a845', '500': '#c4942a',
    },
    paper: {
      '50': '#fbf7ee', '100': '#f5efde', '200': '#ece2c6', '300': '#ddd0ae',
    },
  },
  semantic: { light: LIGHT_SEMANTIC, dark: DARK_SEMANTIC },
  identity: {
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
  },
  typography: {
    fontDisplay: "'Audiowide', system-ui, sans-serif",
    fontBody: "'Exo 2', system-ui, sans-serif",
    fontMono: "'Exo 2', ui-monospace, monospace",
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
  },
  radius: { none: 0, sm: 2, md: 4, lg: 8, pill: 999, full: 50 },
  shadowMemphis: {
    sm: { x: 3, y: 3, color: '#000000' },
    md: { x: 6, y: 6, color: '#000000' },
    lg: { x: 9, y: 9, color: '#000000' },
    hover: { x: 7, y: 7, color: '#000000' },
    active: { x: 2, y: 2, color: '#000000' },
  },
  shadowSoft: { sm: 0.06, md: 0.08, lg: 0.12 },
  spacing: { scale: 1 },
  motion: {
    durations: { snap: 80, fast: 150, base: 200, slow: 300 },
    easings: {
      memphis: 'cubic-bezier(0.4, 1.3, 0.5, 1)',
      out: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const

/**
 * The base spacing scale multiplier affects every `--space-N` token.
 * These are the raw (pre-scale) values in px.
 */
export const SPACING_BASE_PX: ReadonlyArray<readonly [string, number]> = [
  ['space-0', 0], ['space-1', 4], ['space-2', 8], ['space-3', 12],
  ['space-4', 16], ['space-5', 20], ['space-6', 24], ['space-8', 32],
  ['space-10', 40], ['space-12', 48], ['space-16', 64], ['space-20', 80],
]

// ─── Compatibility shims (removed in Task 23) ─────────────────────────────
// page.tsx still imports these legacy identifiers; they will be deleted once
// the page is rewritten in Task 23.

/** @deprecated Use PALETTE_STEPS instead. Removed in Task 23. */
export const COLOR_GROUPS = {
  plum: ['plum-100', 'plum-300', 'plum-500', 'plum-700', 'plum-800', 'plum-900'],
  gold: ['gold-100', 'gold-200', 'gold-300', 'gold-400', 'gold-500'],
  paper: ['paper-50', 'paper-100', 'paper-200', 'paper-300'],
  semantic: ['bg', 'surface', 'surface-2', 'ink', 'ink-soft', 'ink-muted', 'border-memphis', 'accent', 'ring'],
  status: ['success', 'danger', 'warning', 'rage', 'info'],
} as const

/** @deprecated Removed in Task 23. */
export const ALL_COLOR_KEYS: ReadonlyArray<string> = [
  ...COLOR_GROUPS.plum,
  ...COLOR_GROUPS.gold,
  ...COLOR_GROUPS.paper,
  ...COLOR_GROUPS.semantic,
  ...COLOR_GROUPS.status,
]
