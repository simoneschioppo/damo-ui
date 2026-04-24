/**
 * Theme presets — raw palette overrides.
 *
 * Each preset overrides ONLY the raw palette (Layer 1). Semantic mapping
 * (Layer 2) is applied uniformly via themes.css in the lib. This matches
 * the new architecture where palette and theme are orthogonal.
 */

import { DEFAULT_THEME, type Theme, type RawPalette } from './theme-state'

export type PresetName = 'default' | 'neon' | 'sunset'

export const PRESET_LABELS: Record<PresetName, string> = {
  default: 'Plum + Gold (default)',
  neon: 'Neon (magenta + lime)',
  sunset: 'Sunset (terracotta + orange)',
}

const NEON_PALETTE: RawPalette = {
  plum: {
    '100': '#f8c8e7', '300': '#e26dbb', '500': '#b01680',
    '700': '#491a40', '800': '#321029', '900': '#1f0819',
  },
  gold: {
    '100': '#e3facb', '200': '#ccf2a6', '300': '#b4ea7e',
    '400': '#9be04a', '500': '#7fd321',
  },
  paper: DEFAULT_THEME.palette.paper,
}

const SUNSET_PALETTE: RawPalette = {
  plum: {
    '100': '#f8d4c0', '300': '#dd8a6d', '500': '#a8402a',
    '700': '#5a2514', '800': '#3f170d', '900': '#2a0d07',
  },
  gold: {
    '100': '#ffe7cd', '200': '#ffd2a3', '300': '#ffbb75',
    '400': '#fda047', '500': '#f58a1e',
  },
  paper: DEFAULT_THEME.palette.paper,
}

export const PRESET_PALETTES: Record<PresetName, RawPalette> = {
  default: DEFAULT_THEME.palette,
  neon: NEON_PALETTE,
  sunset: SUNSET_PALETTE,
}

export function applyPreset(theme: Theme, preset: PresetName): Theme {
  return { ...theme, palette: PRESET_PALETTES[preset] }
}
