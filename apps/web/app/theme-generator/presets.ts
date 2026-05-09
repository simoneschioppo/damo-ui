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
  // gh-95: cyan/teal ramp — replaces the previous amber. The deep teal
  // brand.500 contrasts AA with white text, so no `primaryForeground`
  // override is needed.
  brand: {
    '100': '#c0fffa',
    '200': '#80f5ec',
    '300': '#40e3d4',
    '400': '#14b8a6',
    '500': '#0f766e',
  },
  // gh-95: cool cyan-tinted cream — diverges from the shared default cream
  // so cyberpunk has a distinct light-mode background identity.
  paper: {
    '50': '#f3fbfa',
    '100': '#e7f5f3',
    '200': '#d3ebe7',
    '300': '#b8d6d1',
  },
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
  // gh-95: copper/rust ramp — replaces the previous amber. brand.500 = #8e4318
  // contrasts AAA with white text.
  brand: {
    '100': '#fde4d3',
    '200': '#f7c19f',
    '300': '#ed996c',
    '400': '#c87444',
    '500': '#8e4318',
  },
  // gh-95: sage-tinted cream — diverges from the shared default cream so
  // forest has a distinct light-mode background identity.
  paper: {
    '50': '#f6f7eb',
    '100': '#ecede0',
    '200': '#ddddc8',
    '300': '#c1c1a8',
  },
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
  // gh-95 dropped the cyberpunk light primaryForeground override: brand.500
  // moved from amber #ffab00 (failed WCAG AA against white) to deep teal
  // #0f766e (~5.7 contrast against white), so the override is no longer
  // needed and keeping it would be dead code.
}

/**
 * Compute a preset's semantic theme for a single mode, applying the
 * canonical mapping AND the per-preset semantic overrides for that mode.
 *
 * Exported because the reducer's `SYNC_PRESET` branch (navbar-driven palette
 * change without wiping user edits) needs to recompute one mode at a time
 * and must not skip the override merge — gh-93 found a regression where the
 * override was applied only via `applyPreset` (the SET_PRESET branch).
 */
export function computePresetSemantic(preset: PresetName, mode: 'light' | 'dark'): SemanticTheme {
  const palette = PRESET_PALETTES[preset]
  const base = mode === 'light' ? computeSemanticLight(palette) : computeSemanticDark(palette)
  const modeOverrides = PRESET_SEMANTIC_OVERRIDES[preset]?.[mode]
  return modeOverrides ? { ...base, ...modeOverrides } : base
}

/**
 * Apply a preset palette to a theme.
 *
 * - Resets BOTH palette modes (light + dark) to the preset's palette —
 *   any per-mode palette divergence is intentionally discarded so the
 *   user sees the preset's intended look uniformly.
 * - Re-derives semantic light + dark from the preset palette and merges
 *   per-preset semantic overrides via `computePresetSemantic`.
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
      light: computePresetSemantic(preset, 'light'),
      dark: computePresetSemantic(preset, 'dark'),
    },
  }
}
