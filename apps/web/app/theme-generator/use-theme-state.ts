'use client'

import { useCallback, useReducer, useEffect } from 'react'
import {
  DEFAULT_THEME,
  computeSemanticLight,
  computeSemanticDark,
  type Theme,
  type ThemeMode,
  type SemanticTheme,
  type RawPalette,
  type IdentityTheme,
  type MedalRank,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
} from './theme-state'
import { type PresetName, applyPreset, PRESET_PALETTES } from './presets'

type Action =
  | { type: 'SET_PRESET'; preset: PresetName }
  | { type: 'SYNC_PRESET'; preset: PresetName }
  | {
      type: 'SET_PALETTE_STEP'
      mode: ThemeMode
      group: 'ink' | 'brand' | 'paper'
      step: string
      value: string
    }
  | { type: 'SET_SEMANTIC'; mode: ThemeMode; key: keyof SemanticTheme; value: string }
  | {
      type: 'SET_MEDAL'
      mode: ThemeMode
      rank: MedalRank
      slot: 'outer' | 'inner' | 'text'
      value: string
    }
  | { type: 'SET_CHART'; mode: ThemeMode; index: '1' | '2' | '3' | '4' | '5'; value: string }
  | {
      type: 'SET_NAV_ON_DARK'
      mode: ThemeMode
      key: 'accent' | 'accentStrong' | 'foreground' | 'foregroundStrong'
      value: string
    }
  | {
      type: 'SET_APP_PATTERN_COLOR'
      mode: ThemeMode
      key: 'color1' | 'color2' | 'color3'
      value: string
    }
  | { type: 'SET_APP_PATTERN_SIZE'; mode: ThemeMode; value: number }
  | {
      type: 'SET_TYPOGRAPHY_FONT'
      mode: ThemeMode
      slot: 'display' | 'body' | 'mono'
      value: string
    }
  | { type: 'SET_TYPOGRAPHY_SIZE'; mode: ThemeMode; key: TypographySizeKey; value: number }
  | { type: 'SET_RADIUS'; mode: ThemeMode; key: RadiusKey; value: number }
  | {
      type: 'SET_SHADOW_MEMPHIS'
      mode: ThemeMode
      key: ShadowMemphisKey
      slot: 'x' | 'y' | 'color'
      value: number | string
    }
  | { type: 'SET_SHADOW_SOFT'; mode: ThemeMode; value: number }
  | { type: 'SET_DURATION'; mode: ThemeMode; key: MotionDurationKey; value: number }
  | { type: 'SET_EASING'; mode: ThemeMode; key: MotionEasingKey; value: string }
  | { type: 'RESET'; preset: PresetName }

/**
 * Structural equality on the well-known RawPalette shape. Iterates a fixed
 * key order so it is immune to JSON key-order variation (e.g., palettes
 * restored from storage may serialise keys differently). Returns true when
 * `p` matches any preset palette known to the generator — used by
 * SYNC_PRESET to decide whether a mode is "untouched" and can therefore
 * accept a navbar-driven preset change.
 */
function rawPaletteEquals(a: RawPalette, b: RawPalette): boolean {
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    if (a.ink[step] !== b.ink[step]) return false
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    if (a.brand[step] !== b.brand[step]) return false
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    if (a.paper[step] !== b.paper[step]) return false
  }
  return true
}

function isKnownPresetPalette(p: RawPalette): boolean {
  return Object.values(PRESET_PALETTES).some((preset) => rawPaletteEquals(preset, p))
}

function updatePaletteStep(
  palette: RawPalette,
  group: 'ink' | 'brand' | 'paper',
  step: string,
  value: string,
): RawPalette {
  const groupMap = palette[group] as Readonly<Record<string, string>>
  return {
    ...palette,
    [group]: { ...groupMap, [step]: value },
  } as RawPalette
}

function updateMedal(
  identity: IdentityTheme,
  rank: MedalRank,
  slot: 'outer' | 'inner' | 'text',
  value: string,
): IdentityTheme {
  return {
    ...identity,
    medals: {
      ...identity.medals,
      [rank]: { ...identity.medals[rank], [slot]: value },
    },
  }
}

export type { Action as ThemeAction }

export function reducer(state: Theme, action: Action): Theme {
  switch (action.type) {
    case 'SET_PRESET':
      return applyPreset(state, action.preset)

    case 'SYNC_PRESET': {
      // Triggered by the navbar MutationObserver. Unlike SET_PRESET, this
      // must NOT clobber per-mode palette/semantic edits the user has made.
      // Strategy: only swap to the new preset's palette in modes where the
      // current palette still matches some known preset (i.e., the user
      // has not diverged that mode). Modes that have been diverged keep
      // their custom palette; their semantic is left untouched too.
      const newPalette = PRESET_PALETTES[action.preset]
      const lightUntouched = isKnownPresetPalette(state.palette.light)
      const darkUntouched = isKnownPresetPalette(state.palette.dark)
      return {
        ...state,
        palette: {
          light: lightUntouched ? newPalette : state.palette.light,
          dark: darkUntouched ? newPalette : state.palette.dark,
        },
        semantic: {
          light: lightUntouched ? computeSemanticLight(newPalette) : state.semantic.light,
          dark: darkUntouched ? computeSemanticDark(newPalette) : state.semantic.dark,
        },
      }
    }

    case 'SET_PALETTE_STEP':
      return {
        ...state,
        palette: {
          ...state.palette,
          [action.mode]: updatePaletteStep(
            state.palette[action.mode],
            action.group,
            action.step,
            action.value,
          ),
        },
      }

    case 'SET_SEMANTIC':
      return {
        ...state,
        semantic: {
          ...state.semantic,
          [action.mode]: { ...state.semantic[action.mode], [action.key]: action.value },
        },
      }

    case 'SET_MEDAL':
      return {
        ...state,
        identity: {
          ...state.identity,
          [action.mode]: updateMedal(
            state.identity[action.mode],
            action.rank,
            action.slot,
            action.value,
          ),
        },
      }

    case 'SET_CHART':
      return {
        ...state,
        identity: {
          ...state.identity,
          [action.mode]: {
            ...state.identity[action.mode],
            charts: { ...state.identity[action.mode].charts, [action.index]: action.value },
          },
        },
      }

    case 'SET_NAV_ON_DARK':
      return {
        ...state,
        identity: {
          ...state.identity,
          [action.mode]: {
            ...state.identity[action.mode],
            navOnDark: { ...state.identity[action.mode].navOnDark, [action.key]: action.value },
          },
        },
      }

    case 'SET_APP_PATTERN_COLOR':
      return {
        ...state,
        identity: {
          ...state.identity,
          [action.mode]: {
            ...state.identity[action.mode],
            appPattern: { ...state.identity[action.mode].appPattern, [action.key]: action.value },
          },
        },
      }

    case 'SET_APP_PATTERN_SIZE':
      return {
        ...state,
        identity: {
          ...state.identity,
          [action.mode]: {
            ...state.identity[action.mode],
            appPattern: { ...state.identity[action.mode].appPattern, size: action.value },
          },
        },
      }

    case 'SET_TYPOGRAPHY_FONT': {
      const fontKey =
        action.slot === 'display' ? 'fontDisplay' : action.slot === 'body' ? 'fontBody' : 'fontMono'
      return {
        ...state,
        typography: {
          ...state.typography,
          [action.mode]: {
            ...state.typography[action.mode],
            [fontKey]: action.value,
          },
        },
      }
    }

    case 'SET_TYPOGRAPHY_SIZE':
      return {
        ...state,
        typography: {
          ...state.typography,
          [action.mode]: {
            ...state.typography[action.mode],
            sizes: { ...state.typography[action.mode].sizes, [action.key]: action.value },
          },
        },
      }

    case 'SET_RADIUS':
      return {
        ...state,
        radius: {
          ...state.radius,
          [action.mode]: { ...state.radius[action.mode], [action.key]: action.value },
        },
      }

    case 'SET_SHADOW_MEMPHIS':
      return {
        ...state,
        shadowMemphis: {
          ...state.shadowMemphis,
          [action.mode]: {
            ...state.shadowMemphis[action.mode],
            [action.key]: {
              ...state.shadowMemphis[action.mode][action.key],
              [action.slot]: action.value,
            },
          },
        },
      }

    case 'SET_SHADOW_SOFT':
      return {
        ...state,
        shadowSoft: {
          ...state.shadowSoft,
          [action.mode]: { md: action.value },
        },
      }

    case 'SET_DURATION':
      return {
        ...state,
        motion: {
          ...state.motion,
          [action.mode]: {
            ...state.motion[action.mode],
            durations: { ...state.motion[action.mode].durations, [action.key]: action.value },
          },
        },
      }

    case 'SET_EASING':
      return {
        ...state,
        motion: {
          ...state.motion,
          [action.mode]: {
            ...state.motion[action.mode],
            easings: { ...state.motion[action.mode].easings, [action.key]: action.value },
          },
        },
      }

    case 'RESET':
      return applyPreset(DEFAULT_THEME, action.preset)

    default:
      return state
  }
}

const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

const INK_STEPS = ['100', '300', '500', '700', '800', '900'] as const
const BRAND_STEPS = ['100', '200', '300', '400', '500'] as const
const PAPER_STEPS = ['50', '100', '200', '300'] as const
const MEDAL_RANKS = ['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const
const CHART_KEYS = ['1', '2', '3', '4', '5'] as const

function emitPaletteVars(palette: RawPalette, lines: string[]): void {
  for (const step of INK_STEPS) lines.push(`  --ink-${step}: ${palette.ink[step]};`)
  for (const step of BRAND_STEPS) lines.push(`  --brand-${step}: ${palette.brand[step]};`)
  for (const step of PAPER_STEPS) lines.push(`  --paper-${step}: ${palette.paper[step]};`)
  // Static neutrals — match the export so live preview never drops --white/--black refs
  lines.push(`  --white: #ffffff;`)
  lines.push(`  --black: #000000;`)
}

function emitIdentityVars(identity: IdentityTheme, lines: string[]): void {
  for (const rank of MEDAL_RANKS) {
    lines.push(`  --medal-${rank}-outer: ${identity.medals[rank].outer};`)
    lines.push(`  --medal-${rank}-inner: ${identity.medals[rank].inner};`)
    lines.push(`  --medal-${rank}-text: ${identity.medals[rank].text};`)
  }
  for (const k of CHART_KEYS) lines.push(`  --chart-${k}: ${identity.charts[k]};`)
  lines.push(`  --nav-on-dark-accent: ${identity.navOnDark.accent};`)
  lines.push(`  --nav-on-dark-accent-strong: ${identity.navOnDark.accentStrong};`)
  lines.push(`  --nav-on-dark-foreground: ${identity.navOnDark.foreground};`)
  lines.push(`  --nav-on-dark-foreground-strong: ${identity.navOnDark.foregroundStrong};`)
  lines.push(`  --app-pattern-color-1: ${identity.appPattern.color1};`)
  lines.push(`  --app-pattern-color-2: ${identity.appPattern.color2};`)
  lines.push(`  --app-pattern-color-3: ${identity.appPattern.color3};`)
  lines.push(`  --app-pattern-size: ${identity.appPattern.size}px;`)
}

function emitSemanticVars(semantic: SemanticTheme, lines: string[]): void {
  Object.entries(semantic).forEach(([k, v]) => {
    lines.push(`  --${toKebab(k)}: ${v};`)
  })
}

/**
 * Inject a single <style id="theme-generator-overrides"> element into
 * <head>. The light selector covers raw palette + identity + semantic +
 * foundations. The dark selector overrides palette + identity + semantic
 * with their dark variants. Selector is scoped to match the active
 * data-palette attribute so overrides win the cascade.
 */
function applyThemeToRoot(theme: Theme): void {
  if (typeof document === 'undefined') return

  const STYLE_ID = 'theme-generator-overrides'
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }

  const root = document.documentElement
  // Read `data-palette` from the live DOM and validate it before interpolating
  // into the CSS selector below. Without this guard a value crafted to escape
  // the selector context (e.g. injected via localStorage from another origin
  // page or browser devtools) could break out and inject arbitrary CSS into
  // the runtime override stylesheet. We accept only the same shape the rest
  // of the codebase uses for palette ids: `[a-z][a-z0-9-]*`.
  const SAFE_PALETTE = /^[a-z][a-z0-9-]*$/
  const rawPalette = root.getAttribute('data-palette')
  const currentPalette = rawPalette && SAFE_PALETTE.test(rawPalette) ? rawPalette : null
  const lightSelector = currentPalette ? `:root[data-palette='${currentPalette}']` : ':root'
  const darkSelector = currentPalette
    ? `:root[data-palette='${currentPalette}'][data-theme='dark']`
    : `:root[data-theme='dark']`

  const lines: string[] = []

  // ─── Light block ──────────────────────────────────────────
  lines.push(`${lightSelector} {`)
  emitPaletteVars(theme.palette.light, lines)
  emitSemanticVars(theme.semantic.light, lines)
  emitIdentityVars(theme.identity.light, lines)
  emitFoundationsVars(theme, 'light', lines)
  lines.push('}')

  // ─── Dark block ───────────────────────────────────────────
  // Live preview emits the full dark variant (no delta encoding) — a
  // redundant override is harmless, a missing one silently fails.
  lines.push('')
  lines.push(`${darkSelector} {`)
  emitPaletteVars(theme.palette.dark, lines)
  emitSemanticVars(theme.semantic.dark, lines)
  emitIdentityVars(theme.identity.dark, lines)
  emitFoundationsVars(theme, 'dark', lines)
  lines.push('}')

  style.textContent = lines.join('\n')
}

function emitFoundationsVars(theme: Theme, mode: ThemeMode, lines: string[]): void {
  const t = theme.typography[mode]
  lines.push(`  --font-display: ${t.fontDisplay};`)
  lines.push(`  --font-body: ${t.fontBody};`)
  lines.push(`  --font-mono: ${t.fontMono};`)
  ;(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).forEach((k) => {
    const cssName = k === 'base' ? '--text-base' : `--text-${k}`
    lines.push(`  ${cssName}: ${t.sizes[k]}px;`)
  })
  const r = theme.radius[mode]
  ;(['none', 'sm', 'md', 'selection', 'pill', 'full'] as const).forEach((k) => {
    const v = r[k]
    const css = k === 'pill' ? '999px' : k === 'full' ? '50%' : v === 0 ? '0' : `${v}px`
    lines.push(`  --radius-${k}: ${css};`)
  })
  const sm = theme.shadowMemphis[mode]
  ;(['sm', 'card', 'md', 'lg', 'hover', 'active'] as const).forEach((k) => {
    const s = sm[k]
    const cssName = k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
    lines.push(`  ${cssName}: ${s.x}px ${s.y}px 0 ${s.color};`)
  })
  const ss = theme.shadowSoft[mode]
  lines.push(`  --shadow-md: 0 2px 8px rgba(0,0,0,${ss.md});`)
  const m = theme.motion[mode]
  ;(['snap', 'fast', 'base', 'slow'] as const).forEach((k) => {
    lines.push(`  --duration-${k}: ${m.durations[k]}ms;`)
  })
  ;(['memphis', 'out'] as const).forEach((k) => {
    lines.push(`  --ease-${k}: ${m.easings[k]};`)
  })
}

export function useThemeState() {
  const [theme, dispatch] = useReducer(reducer, DEFAULT_THEME)

  const applyLive = useCallback(() => {
    applyThemeToRoot(theme)
  }, [theme])

  useEffect(() => {
    applyLive()
  }, [applyLive])

  // Sync the generator's palette state to whatever data-palette the navbar sets.
  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const presetFromAttr = (attr: string | null): PresetName => {
      if (attr === 'neon') return 'neon'
      if (attr === 'sunset') return 'sunset'
      return 'default'
    }

    // Initial sync — uses SYNC_PRESET so any pre-existing palette
    // divergence (e.g., restored from storage in the future) is preserved.
    dispatch({ type: 'SYNC_PRESET', preset: presetFromAttr(root.getAttribute('data-palette')) })

    // Observe future changes — also SYNC, never overwrite user edits.
    const observer = new MutationObserver(() => {
      dispatch({ type: 'SYNC_PRESET', preset: presetFromAttr(root.getAttribute('data-palette')) })
    })
    observer.observe(root, { attributes: true, attributeFilter: ['data-palette'] })

    return () => observer.disconnect()
  }, [])

  return { theme, dispatch }
}
