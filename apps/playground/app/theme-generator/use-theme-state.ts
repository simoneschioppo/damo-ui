'use client'

/**
 * useThemeState — reducer-backed hook for the theme generator page.
 *
 * Responsibilities:
 * - Hold the current `Theme`, the active preset label, and the dark-preview flag.
 * - Expose a generic `updateToken(path, value)` for any nested token.
 * - Apply changes to `document.documentElement` as CSS custom properties
 *   so the preview updates instantly. Resets on unmount to avoid polluting
 *   the rest of the playground.
 */

import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  type Theme,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
  SPACING_BASE_PX,
} from './theme-state'
import { PRESETS, type PresetName } from './presets'

export type ActivePreset = PresetName | 'custom'

interface State {
  theme: Theme
  activePreset: ActivePreset
}

type Action =
  | { type: 'update'; path: string; value: string | number }
  | { type: 'load-preset'; preset: PresetName }
  | { type: 'reset' }

/**
 * Internal mutable mirror of Theme used only inside the reducer.
 * The public API keeps the readonly surface intact.
 */
interface MutableTheme {
  colors: Record<string, string>
  typography: {
    fontDisplay: string
    fontBody: string
    fontMono: string
    sizes: Record<TypographySizeKey, number>
  }
  radius: Record<RadiusKey, number>
  shadowMemphis: Record<ShadowMemphisKey, { x: number; y: number; color: string }>
  shadowSoft: { sm: number; md: number; lg: number }
  spacing: { scale: number }
  motion: {
    durations: Record<MotionDurationKey, number>
    easings: Record<MotionEasingKey, string>
  }
}

const clone = (theme: Theme): MutableTheme => ({
  colors: { ...theme.colors },
  typography: {
    fontDisplay: theme.typography.fontDisplay,
    fontBody: theme.typography.fontBody,
    fontMono: theme.typography.fontMono,
    sizes: { ...theme.typography.sizes },
  },
  radius: { ...theme.radius },
  shadowMemphis: {
    sm: { ...theme.shadowMemphis.sm },
    md: { ...theme.shadowMemphis.md },
    lg: { ...theme.shadowMemphis.lg },
    hover: { ...theme.shadowMemphis.hover },
    active: { ...theme.shadowMemphis.active },
  },
  shadowSoft: { ...theme.shadowSoft },
  spacing: { ...theme.spacing },
  motion: {
    durations: { ...theme.motion.durations },
    easings: { ...theme.motion.easings },
  },
})

/**
 * Apply a dot-path update to the theme, returning a new object.
 * Silently ignores unknown paths rather than throwing in the UI thread.
 */
function applyUpdate(theme: Theme, path: string, value: string | number): Theme {
  const [group, a, b] = path.split('.')
  const next = clone(theme)

  switch (group) {
    case 'colors':
      if (a && typeof value === 'string') next.colors[a] = value
      return next
    case 'typography':
      if (a === 'fontDisplay' && typeof value === 'string') next.typography.fontDisplay = value
      else if (a === 'fontBody' && typeof value === 'string') next.typography.fontBody = value
      else if (a === 'fontMono' && typeof value === 'string') next.typography.fontMono = value
      else if (a === 'sizes' && b && typeof value === 'number') {
        next.typography.sizes[b as TypographySizeKey] = value
      }
      return next
    case 'radius':
      if (a && typeof value === 'number') next.radius[a as RadiusKey] = value
      return next
    case 'shadowMemphis':
      if (a && b) {
        const key = a as ShadowMemphisKey
        if (b === 'x' && typeof value === 'number') next.shadowMemphis[key].x = value
        else if (b === 'y' && typeof value === 'number') next.shadowMemphis[key].y = value
        else if (b === 'color' && typeof value === 'string') next.shadowMemphis[key].color = value
      }
      return next
    case 'shadowSoft':
      if ((a === 'sm' || a === 'md' || a === 'lg') && typeof value === 'number') {
        next.shadowSoft[a] = value
      }
      return next
    case 'spacing':
      if (a === 'scale' && typeof value === 'number') next.spacing.scale = value
      return next
    case 'motion':
      if (a === 'durations' && b && typeof value === 'number') {
        next.motion.durations[b as MotionDurationKey] = value
      } else if (a === 'easings' && b && typeof value === 'string') {
        next.motion.easings[b as MotionEasingKey] = value
      }
      return next
    default:
      return next
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'update':
      return {
        theme: applyUpdate(state.theme, action.path, action.value),
        activePreset: 'custom',
      }
    case 'load-preset':
      return { theme: PRESETS[action.preset], activePreset: action.preset }
    case 'reset': {
      const target = state.activePreset === 'custom' ? 'plum-gold' : state.activePreset
      return { theme: PRESETS[target], activePreset: target }
    }
    default:
      return state
  }
}

/**
 * Collect every CSS var name written by {@link applyThemeToRoot}.
 * Kept in sync with the list below — if you add a property there,
 * add it here too so unmount cleanup stays complete.
 */
export const MANAGED_CSS_VARS: ReadonlyArray<string> = (() => {
  const names: string[] = []
  // Colors — every key in DEFAULT_THEME.colors is always present.
  Object.keys(PRESETS['plum-gold'].colors).forEach((k) => names.push(`--${k}`))

  names.push('--font-display', '--font-body', '--font-mono')
  ;(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).forEach((k) =>
    names.push(k === 'base' ? '--text-base' : `--text-${k}`),
  )

  ;(['none', 'sm', 'md', 'lg', 'pill', 'full'] as const).forEach((k) =>
    names.push(`--radius-${k}`),
  )

  names.push(
    '--shadow-memphis-color',
    '--shadow-memphis-sm',
    '--shadow-memphis',
    '--shadow-memphis-lg',
    '--shadow-memphis-hover',
    '--shadow-memphis-active',
    '--shadow-sm',
    '--shadow-md',
    '--shadow-lg',
  )

  SPACING_BASE_PX.forEach(([name]) => names.push(`--${name}`))

  ;(['snap', 'fast', 'base', 'slow'] as const).forEach((k) => names.push(`--duration-${k}`))
  ;(['memphis', 'out', 'in-out'] as const).forEach((k) => names.push(`--ease-${k}`))
  return names
})()

const radiusToCss = (key: RadiusKey, value: number): string => {
  if (key === 'pill') return '999px'
  if (key === 'full') return '50%'
  if (value === 0) return '0'
  return `${value}px`
}

export function applyThemeToRoot(theme: Theme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const set = (name: string, value: string) => root.style.setProperty(name, value)

  Object.entries(theme.colors).forEach(([k, v]) => set(`--${k}`, v))

  set('--font-display', theme.typography.fontDisplay)
  set('--font-body', theme.typography.fontBody)
  set('--font-mono', theme.typography.fontMono)
  ;(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).forEach((k) => {
    const cssKey = k === 'base' ? '--text-base' : `--text-${k}`
    set(cssKey, `${theme.typography.sizes[k]}px`)
  })

  ;(['none', 'sm', 'md', 'lg', 'pill', 'full'] as const).forEach((k) => {
    set(`--radius-${k}`, radiusToCss(k, theme.radius[k]))
  })

  set('--shadow-memphis-color', theme.shadowMemphis.md.color)
  ;(['sm', 'md', 'lg', 'hover', 'active'] as const).forEach((k) => {
    const s = theme.shadowMemphis[k]
    const cssKey = k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
    set(cssKey, `${s.x}px ${s.y}px 0 ${s.color}`)
  })
  set('--shadow-sm', `0 1px 2px rgba(0, 0, 0, ${theme.shadowSoft.sm})`)
  set('--shadow-md', `0 2px 8px rgba(0, 0, 0, ${theme.shadowSoft.md})`)
  set('--shadow-lg', `0 8px 24px rgba(0, 0, 0, ${theme.shadowSoft.lg})`)

  SPACING_BASE_PX.forEach(([name, px]) => {
    set(`--${name}`, `${Math.round(px * theme.spacing.scale)}px`)
  })

  ;(['snap', 'fast', 'base', 'slow'] as const).forEach((k) => {
    set(`--duration-${k}`, `${theme.motion.durations[k]}ms`)
  })
  ;(['memphis', 'out', 'in-out'] as const).forEach((k) => {
    set(`--ease-${k}`, theme.motion.easings[k])
  })
}

export function resetRootTheme(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  MANAGED_CSS_VARS.forEach((name) => root.style.removeProperty(name))
}

export interface UseThemeStateReturn {
  theme: Theme
  activePreset: ActivePreset
  updateToken: (path: string, value: string | number) => void
  loadPreset: (name: PresetName) => void
  reset: () => void
  darkPreview: boolean
  setDarkPreview: (v: boolean) => void
}

/**
 * Reducer-backed theme state + imperative DOM sync.
 *
 * Starts from the Plum+Gold preset and cleans up on unmount.
 */
export function useThemeState(): UseThemeStateReturn {
  const [state, dispatch] = useReducer(reducer, {
    theme: PRESETS['plum-gold'],
    activePreset: 'plum-gold',
  })
  const [darkPreview, setDarkPreview] = useState(false)

  // Sync the theme to :root on every change. Cleanup runs on unmount.
  useEffect(() => {
    applyThemeToRoot(state.theme)
  }, [state.theme])

  useEffect(() => {
    return () => {
      resetRootTheme()
    }
  }, [])

  const updateToken = useCallback((path: string, value: string | number) => {
    dispatch({ type: 'update', path, value })
  }, [])
  const loadPreset = useCallback((name: PresetName) => {
    dispatch({ type: 'load-preset', preset: name })
  }, [])
  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  return useMemo(
    () => ({
      theme: state.theme,
      activePreset: state.activePreset,
      updateToken,
      loadPreset,
      reset,
      darkPreview,
      setDarkPreview,
    }),
    [state.theme, state.activePreset, updateToken, loadPreset, reset, darkPreview],
  )
}
