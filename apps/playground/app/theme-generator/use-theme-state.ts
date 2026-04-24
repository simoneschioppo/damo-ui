'use client'

import { useCallback, useReducer, useEffect, useState } from 'react'
import {
  DEFAULT_THEME,
  type Theme,
  type SemanticTheme,
  type RawPalette,
  type MedalRank,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
  SPACING_BASE_PX,
} from './theme-state'
import { type PresetName, applyPreset } from './presets'

type Action =
  | { type: 'SET_PRESET'; preset: PresetName }
  | { type: 'SET_PALETTE_STEP'; group: 'plum' | 'gold' | 'paper'; step: string; value: string }
  | { type: 'SET_SEMANTIC'; mode: 'light' | 'dark'; key: keyof SemanticTheme; value: string }
  | { type: 'SET_MEDAL'; rank: MedalRank; slot: 'outer' | 'inner' | 'text'; value: string }
  | { type: 'SET_CHART'; index: '1' | '2' | '3' | '4' | '5'; value: string }
  | { type: 'SET_NAV_ON_DARK'; key: 'accent' | 'accentStrong' | 'foreground' | 'foregroundStrong'; value: string }
  | { type: 'SET_TYPOGRAPHY_FONT'; slot: 'display' | 'body' | 'mono'; value: string }
  | { type: 'SET_TYPOGRAPHY_SIZE'; key: TypographySizeKey; value: number }
  | { type: 'SET_RADIUS'; key: RadiusKey; value: number }
  | { type: 'SET_SHADOW_MEMPHIS'; key: ShadowMemphisKey; slot: 'x' | 'y' | 'color'; value: number | string }
  | { type: 'SET_SHADOW_SOFT'; key: 'sm' | 'md' | 'lg'; value: number }
  | { type: 'SET_SPACING_SCALE'; value: number }
  | { type: 'SET_DURATION'; key: MotionDurationKey; value: number }
  | { type: 'SET_EASING'; key: MotionEasingKey; value: string }
  | { type: 'RESET' }

function reducer(state: Theme, action: Action): Theme {
  switch (action.type) {
    case 'SET_PRESET':
      return applyPreset(state, action.preset)

    case 'SET_PALETTE_STEP': {
      const group = state.palette[action.group] as Readonly<Record<string, string>>
      return {
        ...state,
        palette: {
          ...state.palette,
          [action.group]: { ...group, [action.step]: action.value },
        } as RawPalette,
      }
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
          medals: {
            ...state.identity.medals,
            [action.rank]: { ...state.identity.medals[action.rank], [action.slot]: action.value },
          },
        },
      }

    case 'SET_CHART':
      return {
        ...state,
        identity: {
          ...state.identity,
          charts: { ...state.identity.charts, [action.index]: action.value },
        },
      }

    case 'SET_NAV_ON_DARK':
      return {
        ...state,
        identity: {
          ...state.identity,
          navOnDark: { ...state.identity.navOnDark, [action.key]: action.value },
        },
      }

    case 'SET_TYPOGRAPHY_FONT':
      return {
        ...state,
        typography: {
          ...state.typography,
          [action.slot === 'display' ? 'fontDisplay' :
           action.slot === 'body' ? 'fontBody' : 'fontMono']: action.value,
        },
      }

    case 'SET_TYPOGRAPHY_SIZE':
      return {
        ...state,
        typography: {
          ...state.typography,
          sizes: { ...state.typography.sizes, [action.key]: action.value },
        },
      }

    case 'SET_RADIUS':
      return { ...state, radius: { ...state.radius, [action.key]: action.value } }

    case 'SET_SHADOW_MEMPHIS':
      return {
        ...state,
        shadowMemphis: {
          ...state.shadowMemphis,
          [action.key]: { ...state.shadowMemphis[action.key], [action.slot]: action.value },
        },
      }

    case 'SET_SHADOW_SOFT':
      return {
        ...state,
        shadowSoft: { ...state.shadowSoft, [action.key]: action.value },
      }

    case 'SET_SPACING_SCALE':
      return { ...state, spacing: { scale: action.value } }

    case 'SET_DURATION':
      return {
        ...state,
        motion: {
          ...state.motion,
          durations: { ...state.motion.durations, [action.key]: action.value },
        },
      }

    case 'SET_EASING':
      return {
        ...state,
        motion: {
          ...state.motion,
          easings: { ...state.motion.easings, [action.key]: action.value },
        },
      }

    case 'RESET':
      return DEFAULT_THEME

    default:
      return state
  }
}

/**
 * Write theme values to :root and :root[data-theme='dark'] so the live
 * preview updates. Uses the passed `previewMode` to decide which
 * semantic set is active on :root (so changing the preview toggle flips
 * the visible styling without waiting for a re-render cycle).
 */
function applyThemeToRoot(theme: Theme, previewMode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  const setVar = (name: string, value: string | number): void => {
    root.style.setProperty(name, String(value))
  }
  const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

  // Layer 1 — raw palette
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    setVar(`--plum-${step}`, theme.palette.plum[step])
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    setVar(`--gold-${step}`, theme.palette.gold[step])
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    setVar(`--paper-${step}`, theme.palette.paper[step])
  }

  // Layer 2 — semantic (apply the preview mode)
  const active = previewMode === 'dark' ? theme.semantic.dark : theme.semantic.light
  Object.entries(active).forEach(([k, v]) => {
    setVar(`--${toKebab(k)}`, v as string)
  })

  // Layer 3 — identity (theme-agnostic)
  const ranks: ReadonlyArray<MedalRank> = ['bronze', 'silver', 'gold', 'master', 'grandmaster']
  ranks.forEach((rank) => {
    setVar(`--medal-${rank}-outer`, theme.identity.medals[rank].outer)
    setVar(`--medal-${rank}-inner`, theme.identity.medals[rank].inner)
    setVar(`--medal-${rank}-text`, theme.identity.medals[rank].text)
  })
  ;(['1', '2', '3', '4', '5'] as const).forEach((k) => {
    setVar(`--chart-${k}`, theme.identity.charts[k])
  })
  setVar(`--nav-on-dark-accent`, theme.identity.navOnDark.accent)
  setVar(`--nav-on-dark-accent-strong`, theme.identity.navOnDark.accentStrong)
  setVar(`--nav-on-dark-foreground`, theme.identity.navOnDark.foreground)
  setVar(`--nav-on-dark-foreground-strong`, theme.identity.navOnDark.foregroundStrong)

  // Typography, radius, shadow, spacing, motion — same as before but
  // referencing the new shape
  setVar('--font-display', theme.typography.fontDisplay)
  setVar('--font-body', theme.typography.fontBody)
  setVar('--font-mono', theme.typography.fontMono)
  ;(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).forEach((k) => {
    setVar(k === 'base' ? '--text-base' : `--text-${k}`, `${theme.typography.sizes[k]}px`)
  })
  ;(['none', 'sm', 'md', 'lg', 'pill', 'full'] as const).forEach((k) => {
    const v = theme.radius[k]
    const css = k === 'pill' ? '999px' : k === 'full' ? '50%' : v === 0 ? '0' : `${v}px`
    setVar(`--radius-${k}`, css)
  })
  ;(['sm', 'md', 'lg', 'hover', 'active'] as const).forEach((k) => {
    const s = theme.shadowMemphis[k]
    const cssName = k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
    setVar(cssName, `${s.x}px ${s.y}px 0 ${s.color}`)
  })
  SPACING_BASE_PX.forEach(([k, px]) => {
    setVar(`--${k}`, `${px * theme.spacing.scale}px`)
  })
  ;(['snap', 'fast', 'base', 'slow'] as const).forEach((k) => {
    setVar(`--duration-${k}`, `${theme.motion.durations[k]}ms`)
  })
  ;(['memphis', 'out', 'in-out'] as const).forEach((k) => {
    setVar(`--ease-${k}`, theme.motion.easings[k])
  })
}

export function useThemeState() {
  const [theme, dispatch] = useReducer(reducer, DEFAULT_THEME)

  // The generator previews light or dark independently of the rest of the app.
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')

  const applyLive = useCallback(() => {
    applyThemeToRoot(theme, previewMode)
  }, [theme, previewMode])

  useEffect(() => {
    applyLive()
  }, [applyLive])

  return { theme, dispatch, previewMode, setPreviewMode }
}
