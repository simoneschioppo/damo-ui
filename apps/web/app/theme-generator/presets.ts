/**
 * Theme presets — raw palette overrides.
 *
 * Each preset overrides the raw palette for both light and dark variants
 * (Layer 1) and re-derives the semantic mapping (Layer 2). Identity (Layer 3)
 * is preserved across preset changes — users may diverge identity per mode.
 */

import {
  DEFAULT_THEME,
  computeSemanticLight,
  computeSemanticDark,
  type Theme,
  type RawPalette,
} from './theme-state'

export type PresetName = 'default' | 'neon' | 'sunset'

export const PRESET_LABELS: Record<PresetName, string> = {
  default: 'Plum + Gold (default)',
  neon: 'Neon (magenta + lime)',
  sunset: 'Sunset (terracotta + orange)',
}

const NEON_PALETTE: RawPalette = {
  ink: {
    '100': '#f8c8e7',
    '300': '#e26dbb',
    '500': '#b01680',
    '700': '#491a40',
    '800': '#321029',
    '900': '#1f0819',
  },
  brand: {
    '100': '#e3facb',
    '200': '#ccf2a6',
    '300': '#b4ea7e',
    '400': '#9be04a',
    '500': '#7fd321',
  },
  paper: DEFAULT_THEME.palette.light.paper,
}

const SUNSET_PALETTE: RawPalette = {
  ink: {
    '100': '#f8d4c0',
    '300': '#dd8a6d',
    '500': '#a8402a',
    '700': '#5a2514',
    '800': '#3f170d',
    '900': '#2a0d07',
  },
  brand: {
    '100': '#ffe7cd',
    '200': '#ffd2a3',
    '300': '#ffbb75',
    '400': '#fda047',
    '500': '#f58a1e',
  },
  paper: DEFAULT_THEME.palette.light.paper,
}

export const PRESET_PALETTES: Record<PresetName, RawPalette> = {
  default: DEFAULT_THEME.palette.light,
  neon: NEON_PALETTE,
  sunset: SUNSET_PALETTE,
}

/**
 * Apply a preset palette to a theme.
 *
 * - Resets BOTH palette modes (light + dark) to the preset's palette —
 *   any per-mode palette divergence is intentionally discarded so the
 *   user sees the preset's intended look uniformly.
 * - Re-derives semantic light + dark from the preset palette.
 * - Preserves identity (medals/charts/navOnDark/appPattern) for both
 *   modes, including any user-diverged dark-mode customisations.
 * - Preserves typography, radius, shadow, spacing, motion.
 */
export function applyPreset(theme: Theme, preset: PresetName): Theme {
  const newPalette = PRESET_PALETTES[preset]
  return {
    ...theme,
    palette: {
      light: newPalette,
      dark: newPalette,
    },
    semantic: {
      light: computeSemanticLight(newPalette),
      dark: computeSemanticDark(newPalette),
    },
  }
}
