'use client'

import { useCallback, useReducer, useEffect } from 'react'
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
 * Inject a single <style id="theme-generator-overrides"> element into
 * <head> containing both light and dark semantic blocks. The selector is
 * scoped to match the active data-palette attribute so the overrides win
 * the cascade over static rules in theme.css that use :root[data-palette='…']
 * (specificity 0,2,0 vs bare :root 0,1,0).
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
  const currentPalette = root.getAttribute('data-palette')
  const lightSelector = currentPalette
    ? `:root[data-palette='${currentPalette}']`
    : ':root'
  const darkSelector = currentPalette
    ? `:root[data-palette='${currentPalette}'][data-theme='dark']`
    : `:root[data-theme='dark']`

  const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

  const lines: string[] = []

  lines.push(`${lightSelector} {`)

  // Raw palette
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    lines.push(`  --plum-${step}: ${theme.palette.plum[step]};`)
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    lines.push(`  --gold-${step}: ${theme.palette.gold[step]};`)
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    lines.push(`  --paper-${step}: ${theme.palette.paper[step]};`)
  }

  // Light semantic
  Object.entries(theme.semantic.light).forEach(([k, v]) => {
    lines.push(`  --${toKebab(k)}: ${v};`)
  })

  // Identity (theme-agnostic)
  ;(['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const).forEach((rank) => {
    lines.push(`  --medal-${rank}-outer: ${theme.identity.medals[rank].outer};`)
    lines.push(`  --medal-${rank}-inner: ${theme.identity.medals[rank].inner};`)
    lines.push(`  --medal-${rank}-text: ${theme.identity.medals[rank].text};`)
  })
  ;(['1', '2', '3', '4', '5'] as const).forEach((k) => {
    lines.push(`  --chart-${k}: ${theme.identity.charts[k]};`)
  })
  lines.push(`  --nav-on-dark-accent: ${theme.identity.navOnDark.accent};`)
  lines.push(`  --nav-on-dark-accent-strong: ${theme.identity.navOnDark.accentStrong};`)
  lines.push(`  --nav-on-dark-foreground: ${theme.identity.navOnDark.foreground};`)
  lines.push(`  --nav-on-dark-foreground-strong: ${theme.identity.navOnDark.foregroundStrong};`)

  // Typography
  lines.push(`  --font-display: ${theme.typography.fontDisplay};`)
  lines.push(`  --font-body: ${theme.typography.fontBody};`)
  lines.push(`  --font-mono: ${theme.typography.fontMono};`)
  ;(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).forEach((k) => {
    const cssName = k === 'base' ? '--text-base' : `--text-${k}`
    lines.push(`  ${cssName}: ${theme.typography.sizes[k]}px;`)
  })

  // Radius
  ;(['none', 'sm', 'md', 'lg', 'pill', 'full'] as const).forEach((k) => {
    const v = theme.radius[k]
    const css = k === 'pill' ? '999px' : k === 'full' ? '50%' : v === 0 ? '0' : `${v}px`
    lines.push(`  --radius-${k}: ${css};`)
  })

  // Shadow memphis
  ;(['sm', 'md', 'lg', 'hover', 'active'] as const).forEach((k) => {
    const s = theme.shadowMemphis[k]
    const cssName = k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
    lines.push(`  ${cssName}: ${s.x}px ${s.y}px 0 ${s.color};`)
  })

  // Spacing (uses SPACING_BASE_PX)
  SPACING_BASE_PX.forEach(([k, px]) => {
    lines.push(`  --${k}: ${px * theme.spacing.scale}px;`)
  })

  // Motion
  ;(['snap', 'fast', 'base', 'slow'] as const).forEach((k) => {
    lines.push(`  --duration-${k}: ${theme.motion.durations[k]}ms;`)
  })
  ;(['memphis', 'out', 'in-out'] as const).forEach((k) => {
    lines.push(`  --ease-${k}: ${theme.motion.easings[k]};`)
  })

  lines.push('}')

  // Dark semantic
  lines.push('')
  lines.push(`${darkSelector} {`)
  Object.entries(theme.semantic.dark).forEach(([k, v]) => {
    lines.push(`  --${toKebab(k)}: ${v};`)
  })
  lines.push('}')

  style.textContent = lines.join('\n')
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

    // Initial sync
    dispatch({ type: 'SET_PRESET', preset: presetFromAttr(root.getAttribute('data-palette')) })

    // Observe future changes
    const observer = new MutationObserver(() => {
      dispatch({ type: 'SET_PRESET', preset: presetFromAttr(root.getAttribute('data-palette')) })
      // Defensive re-apply with the new selector in case of race conditions
      applyThemeToRoot(theme)
    })
    observer.observe(root, { attributes: true, attributeFilter: ['data-palette'] })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount-only; the inner closure reads theme at call time

  return { theme, dispatch }
}
