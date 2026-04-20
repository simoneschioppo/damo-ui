/**
 * Theme generator — core types + canonical defaults.
 *
 * Values come from `packages/ui/src/styles/tokens.css` (sole source of
 * truth). Keep in sync when tokens.css changes.
 *
 * All objects are treated as immutable — the reducer returns new copies
 * on every update.
 */

export type MedalRank = 'bronze' | 'silver' | 'gold' | 'master' | 'grandmaster'

export type TypographySizeKey = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
export type RadiusKey = 'none' | 'sm' | 'md' | 'lg' | 'pill' | 'full'
export type ShadowMemphisKey = 'sm' | 'md' | 'lg' | 'hover' | 'active'
export type ShadowSoftKey = 'sm' | 'md' | 'lg'
export type MotionDurationKey = 'snap' | 'fast' | 'base' | 'slow'
export type MotionEasingKey = 'memphis' | 'out' | 'in-out'

export interface ShadowMemphisValue {
  x: number
  y: number
  color: string
}

export interface Theme {
  readonly colors: Readonly<Record<string, string>>
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

/**
 * Canonical color keys (matches `:root` from tokens.css).
 * Exported so the UI can iterate grouped sections.
 */
export const COLOR_GROUPS = {
  plum: ['plum-100', 'plum-300', 'plum-500', 'plum-700', 'plum-800', 'plum-900'],
  gold: ['gold-100', 'gold-200', 'gold-300', 'gold-400', 'gold-500'],
  paper: ['paper-50', 'paper-100', 'paper-200', 'paper-300'],
  semantic: [
    'bg',
    'surface',
    'surface-2',
    'ink',
    'ink-soft',
    'ink-muted',
    'border-memphis',
    'accent',
    'ring',
  ],
  status: ['success', 'danger', 'warning', 'rage', 'info'],
} as const

export const ALL_COLOR_KEYS: ReadonlyArray<string> = [
  ...COLOR_GROUPS.plum,
  ...COLOR_GROUPS.gold,
  ...COLOR_GROUPS.paper,
  ...COLOR_GROUPS.semantic,
  ...COLOR_GROUPS.status,
]

/**
 * Default theme — identical to `:root` in tokens.css.
 * Semantic aliases are pre-resolved to their literal hex so the live
 * editor can surface a concrete color in the color picker.
 */
export const DEFAULT_THEME: Theme = {
  colors: {
    'plum-100': '#e0c6e2',
    'plum-300': '#b17cb5',
    'plum-500': '#7a3980',
    'plum-700': '#522357',
    'plum-800': '#3d1a40',
    'plum-900': '#2a0f2d',
    'gold-100': '#f8e5bc',
    'gold-200': '#f0d49a',
    'gold-300': '#e5bc6d',
    'gold-400': '#d5a845',
    'gold-500': '#c4942a',
    'paper-50': '#fbf7ee',
    'paper-100': '#f5efde',
    'paper-200': '#ece2c6',
    'paper-300': '#ddd0ae',
    bg: '#fbf7ee',
    surface: '#ffffff',
    'surface-2': '#f5efde',
    ink: '#2a0f2d',
    'ink-soft': '#522357',
    'ink-muted': '#b17cb5',
    'border-memphis': '#000000',
    accent: '#c4942a',
    ring: '#c4942a',
    success: '#4f8a3c',
    danger: '#a13a2c',
    warning: '#8a6326',
    rage: '#c94a2f',
    info: '#7a3980',
  },
  typography: {
    fontDisplay: "'Audiowide', system-ui, sans-serif",
    fontBody: "'Exo 2', system-ui, sans-serif",
    fontMono: "'Exo 2', ui-monospace, monospace",
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
  },
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    pill: 999,
    full: 50,
  },
  shadowMemphis: {
    sm: { x: 3, y: 3, color: '#000000' },
    md: { x: 6, y: 6, color: '#000000' },
    lg: { x: 9, y: 9, color: '#000000' },
    hover: { x: 7, y: 7, color: '#000000' },
    active: { x: 2, y: 2, color: '#000000' },
  },
  shadowSoft: {
    sm: 0.06,
    md: 0.08,
    lg: 0.12,
  },
  spacing: { scale: 1 },
  motion: {
    durations: {
      snap: 80,
      fast: 150,
      base: 200,
      slow: 300,
    },
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
