/**
 * Theme presets — three curated palettes the user can snap to.
 *
 * "plum-gold" is the identity default (identical to DEFAULT_THEME).
 * "neon" and "sunset" re-map Plum+Gold palette groups while keeping
 * every non-color token identical, mirroring the overrides defined in
 * `packages/ui/src/styles/themes.css`.
 */

import { DEFAULT_THEME, type Theme } from './theme-state'

export type PresetName = 'plum-gold' | 'neon' | 'sunset'

const withColors = (overrides: Record<string, string>): Theme => ({
  ...DEFAULT_THEME,
  colors: { ...DEFAULT_THEME.colors, ...overrides },
})

/**
 * Neon — magenta + lime (Memphis 80s pure).
 * Note: paper / semantic / status come from DEFAULT_THEME unchanged.
 */
const NEON_COLORS: Record<string, string> = {
  'plum-100': '#f8c8e7',
  'plum-300': '#e26dbb',
  'plum-500': '#b01680',
  'plum-700': '#491a40',
  'plum-800': '#321029',
  'plum-900': '#1f0819',
  'gold-100': '#e3facb',
  'gold-200': '#ccf2a6',
  'gold-300': '#b4ea7e',
  'gold-400': '#9be04a',
  'gold-500': '#7fd321',
  // Semantic re-resolution so live editor shows consistent values
  ink: '#1f0819',
  'ink-soft': '#491a40',
  'ink-muted': '#e26dbb',
  accent: '#7fd321',
  ring: '#7fd321',
  info: '#b01680',
}

/**
 * Sunset — terracotta + warm orange.
 */
const SUNSET_COLORS: Record<string, string> = {
  'plum-100': '#f8d4c0',
  'plum-300': '#dd8a6d',
  'plum-500': '#a8402a',
  'plum-700': '#5a2514',
  'plum-800': '#3f170d',
  'plum-900': '#2a0d07',
  'gold-100': '#ffe7cd',
  'gold-200': '#ffd2a3',
  'gold-300': '#ffbb75',
  'gold-400': '#fda047',
  'gold-500': '#f58a1e',
  ink: '#2a0d07',
  'ink-soft': '#5a2514',
  'ink-muted': '#dd8a6d',
  accent: '#f58a1e',
  ring: '#f58a1e',
  info: '#a8402a',
}

export const PRESETS: Readonly<Record<PresetName, Theme>> = {
  'plum-gold': DEFAULT_THEME,
  neon: withColors(NEON_COLORS),
  sunset: withColors(SUNSET_COLORS),
} as const

export const PRESET_LABELS: Readonly<Record<PresetName, string>> = {
  'plum-gold': 'Plum + Gold',
  neon: 'Neon',
  sunset: 'Sunset',
} as const
