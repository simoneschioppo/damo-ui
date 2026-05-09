/**
 * Theme presets — raw palette overrides + per-preset semantic exceptions.
 *
 * Each preset overrides the raw palette for both light and dark variants
 * (Layer 1) and re-derives the semantic mapping (Layer 2). Identity (Layer 3)
 * is preserved across preset changes — users may diverge identity per mode.
 *
 * gh-93: a small per-preset semantic-override system handles cases where the
 * canonical mapping conflicts with the preset's intent (e.g. cyberpunk's
 * vivid amber primary needs dark text; sunset wants a black memphis border in
 * dark instead of the gh-91 light-gray default sized for plum/gold).
 */

import {
  DEFAULT_THEME,
  computeSemanticLight,
  computeSemanticDark,
  type Theme,
  type RawPalette,
  type SemanticTheme,
} from './theme-state'

export type PresetName = 'default' | 'sunset' | 'cyberpunk' | 'forest'

export const PRESET_NAMES = [
  'default',
  'sunset',
  'cyberpunk',
  'forest',
] as const satisfies readonly PresetName[]

export const PRESET_LABELS: Record<PresetName, string> = {
  default: 'Plum + Gold (default)',
  sunset: 'Sunset (terracotta + orange)',
  cyberpunk: 'Cyberpunk (violet + amber)',
  forest: 'Forest (green + amber)',
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

const CYBERPUNK_PALETTE: RawPalette = {
  ink: {
    '100': '#f0d4ff',
    '300': '#b388ff',
    '500': '#7c4dff',
    '700': '#3d1c75',
    '800': '#2a1052',
    '900': '#170731',
  },
  brand: {
    '100': '#fff4b3',
    '200': '#ffe57a',
    '300': '#ffd740',
    '400': '#ffc107',
    '500': '#ffab00',
  },
  paper: DEFAULT_THEME.palette.light.paper,
}

const FOREST_PALETTE: RawPalette = {
  ink: {
    '100': '#d6ead2',
    '300': '#8cbf85',
    '500': '#2f6b3b',
    '700': '#1d4226',
    '800': '#14301c',
    '900': '#0c1f12',
  },
  brand: {
    '100': '#fde6b8',
    '200': '#f7d28a',
    '300': '#f0bb55',
    '400': '#e6a02e',
    '500': '#a8590e',
  },
  paper: DEFAULT_THEME.palette.light.paper,
}

export const PRESET_PALETTES: Record<PresetName, RawPalette> = {
  default: DEFAULT_THEME.palette.light,
  sunset: SUNSET_PALETTE,
  cyberpunk: CYBERPUNK_PALETTE,
  forest: FOREST_PALETTE,
}

/**
 * Per-preset semantic overrides. Applied AFTER `computeSemanticLight/Dark`
 * inside `applyPreset`. Use sparingly — the canonical mapping should cover
 * most palettes. Override entries exist when the canonical result conflicts
 * with the preset's intent.
 */
type PresetSemanticOverrides = {
  readonly light?: Partial<SemanticTheme>
  readonly dark?: Partial<SemanticTheme>
}

const PRESET_SEMANTIC_OVERRIDES: Partial<Record<PresetName, PresetSemanticOverrides>> = {
  // Sunset's terracotta dark surfaces let a black memphis border breathe;
  // the gh-91 lift to #cccccc was sized for the plum/gold defaults.
  sunset: { dark: { memphisBorderColor: '#000000' } },
  // Cyberpunk's vivid amber `brand.500 = #ffab00` fails WCAG AA against
  // white text (~1.97). Override to ink.900 for ~12.96 contrast.
  cyberpunk: { light: { primaryForeground: '#170731' } },
}

/**
 * Apply a preset palette to a theme.
 *
 * - Resets BOTH palette modes (light + dark) to the preset's palette —
 *   any per-mode palette divergence is intentionally discarded so the
 *   user sees the preset's intended look uniformly.
 * - Re-derives semantic light + dark from the preset palette.
 * - Merges per-preset semantic overrides on top of the canonical result.
 * - Preserves identity (medals/charts/navOnDark/appPattern) for both
 *   modes, including any user-diverged dark-mode customisations.
 * - Preserves typography, radius, shadow, spacing, motion.
 */
export function applyPreset(theme: Theme, preset: PresetName): Theme {
  const newPalette = PRESET_PALETTES[preset]
  const overrides = PRESET_SEMANTIC_OVERRIDES[preset]
  const baseLight = computeSemanticLight(newPalette)
  const baseDark = computeSemanticDark(newPalette)
  return {
    ...theme,
    palette: {
      light: newPalette,
      dark: newPalette,
    },
    semantic: {
      light: overrides?.light ? { ...baseLight, ...overrides.light } : baseLight,
      dark: overrides?.dark ? { ...baseDark, ...overrides.dark } : baseDark,
    },
  }
}
