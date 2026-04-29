/**
 * Pure-function tests for the theme reducer. The reducer itself never
 * touches the DOM, so we exercise it directly without React or jsdom —
 * this keeps tests fast and avoids cross-test order dependencies that a
 * mounted hook (with MutationObserver / data-palette side effects) would
 * introduce.
 */

import { describe, it, expect } from 'vitest'
import { reducer } from './use-theme-state'
import { DEFAULT_THEME } from './theme-state'

describe('reducer — palette per-mode editing', () => {
  it('SET_PALETTE_STEP for light updates only light palette', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_PALETTE_STEP',
      mode: 'light',
      group: 'brand',
      step: '500',
      value: '#123456',
    })
    expect(next.palette.light.brand['500']).toBe('#123456')
    expect(next.palette.dark.brand['500']).toBe(DEFAULT_THEME.palette.dark.brand['500'])
  })

  it('SET_PALETTE_STEP for dark updates only dark palette', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_PALETTE_STEP',
      mode: 'dark',
      group: 'ink',
      step: '900',
      value: '#000111',
    })
    expect(next.palette.dark.ink['900']).toBe('#000111')
    expect(next.palette.light.ink['900']).toBe(DEFAULT_THEME.palette.light.ink['900'])
  })

  it('does not mutate the input theme', () => {
    const before = JSON.stringify(DEFAULT_THEME)
    reducer(DEFAULT_THEME, {
      type: 'SET_PALETTE_STEP',
      mode: 'dark',
      group: 'paper',
      step: '50',
      value: '#abcdef',
    })
    expect(JSON.stringify(DEFAULT_THEME)).toBe(before)
  })
})

describe('reducer — identity per-mode editing', () => {
  it('SET_MEDAL for light updates only light identity', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_MEDAL',
      mode: 'light',
      rank: 'gold',
      slot: 'inner',
      value: '#facade',
    })
    expect(next.identity.light.medals.gold.inner).toBe('#facade')
    expect(next.identity.dark.medals.gold.inner).toBe(
      DEFAULT_THEME.identity.dark.medals.gold.inner,
    )
  })

  it('SET_CHART for dark updates only dark identity', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_CHART',
      mode: 'dark',
      index: '1',
      value: '#deadbe',
    })
    expect(next.identity.dark.charts['1']).toBe('#deadbe')
    expect(next.identity.light.charts['1']).toBe(DEFAULT_THEME.identity.light.charts['1'])
  })

  it('SET_NAV_ON_DARK for light updates only light navOnDark', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_NAV_ON_DARK',
      mode: 'light',
      key: 'accent',
      value: '#abcabc',
    })
    expect(next.identity.light.navOnDark.accent).toBe('#abcabc')
    expect(next.identity.dark.navOnDark.accent).toBe(
      DEFAULT_THEME.identity.dark.navOnDark.accent,
    )
  })
})

describe('reducer — semantic per-mode editing (regression)', () => {
  it('SET_SEMANTIC for dark only updates dark semantic', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_SEMANTIC',
      mode: 'dark',
      key: 'primary',
      value: '#feedee',
    })
    expect(next.semantic.dark.primary).toBe('#feedee')
    expect(next.semantic.light.primary).toBe(DEFAULT_THEME.semantic.light.primary)
  })
})

describe('reducer — preset application preserves diverged identity', () => {
  it('SET_PRESET preserves user-diverged identity for both modes', () => {
    const divergedLight = reducer(DEFAULT_THEME, {
      type: 'SET_MEDAL',
      mode: 'light',
      rank: 'gold',
      slot: 'inner',
      value: '#aaaaaa',
    })
    const divergedBoth = reducer(divergedLight, {
      type: 'SET_CHART',
      mode: 'dark',
      index: '1',
      value: '#bbbbbb',
    })
    const next = reducer(divergedBoth, { type: 'SET_PRESET', preset: 'neon' })
    expect(next.identity.light.medals.gold.inner).toBe('#aaaaaa')
    expect(next.identity.dark.charts['1']).toBe('#bbbbbb')
  })
})

describe('reducer — foundations per-mode editing', () => {
  it('SET_TYPOGRAPHY_FONT for light only updates light typography', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_TYPOGRAPHY_FONT',
      mode: 'light',
      slot: 'display',
      value: 'Comic Sans',
    })
    expect(next.typography.light.fontDisplay).toBe('Comic Sans')
    expect(next.typography.dark.fontDisplay).toBe(DEFAULT_THEME.typography.dark.fontDisplay)
  })

  it('SET_TYPOGRAPHY_SIZE for dark only updates dark sizes', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_TYPOGRAPHY_SIZE',
      mode: 'dark',
      key: 'base',
      value: 22,
    })
    expect(next.typography.dark.sizes.base).toBe(22)
    expect(next.typography.light.sizes.base).toBe(DEFAULT_THEME.typography.light.sizes.base)
  })

  it('SET_RADIUS for light only updates light radius', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_RADIUS',
      mode: 'light',
      key: 'lg',
      value: 99,
    })
    expect(next.radius.light.lg).toBe(99)
    expect(next.radius.dark.lg).toBe(DEFAULT_THEME.radius.dark.lg)
  })

  it('SET_SHADOW_MEMPHIS for dark only updates dark shadow', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_SHADOW_MEMPHIS',
      mode: 'dark',
      key: 'md',
      slot: 'color',
      value: '#fafafa',
    })
    expect(next.shadowMemphis.dark.md.color).toBe('#fafafa')
    expect(next.shadowMemphis.light.md.color).toBe(DEFAULT_THEME.shadowMemphis.light.md.color)
  })

  it('SET_SHADOW_SOFT for light only updates light shadow soft', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_SHADOW_SOFT',
      mode: 'light',
      key: 'lg',
      value: 0.5,
    })
    expect(next.shadowSoft.light.lg).toBe(0.5)
    expect(next.shadowSoft.dark.lg).toBe(DEFAULT_THEME.shadowSoft.dark.lg)
  })

  it('SET_SPACING_SCALE for dark only updates dark spacing scale', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_SPACING_SCALE',
      mode: 'dark',
      value: 1.25,
    })
    expect(next.spacing.dark.scale).toBe(1.25)
    expect(next.spacing.light.scale).toBe(DEFAULT_THEME.spacing.light.scale)
  })

  it('SET_DURATION for light only updates light durations', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_DURATION',
      mode: 'light',
      key: 'base',
      value: 999,
    })
    expect(next.motion.light.durations.base).toBe(999)
    expect(next.motion.dark.durations.base).toBe(DEFAULT_THEME.motion.dark.durations.base)
  })

  it('SET_EASING for dark only updates dark easings', () => {
    const next = reducer(DEFAULT_THEME, {
      type: 'SET_EASING',
      mode: 'dark',
      key: 'memphis',
      value: 'linear',
    })
    expect(next.motion.dark.easings.memphis).toBe('linear')
    expect(next.motion.light.easings.memphis).toBe(DEFAULT_THEME.motion.light.easings.memphis)
  })
})

describe('reducer — SYNC_PRESET (navbar-driven) preserves palette divergence', () => {
  // The MutationObserver on data-palette dispatches a sync action when the
  // user changes preset via the navbar. Unlike a deliberate SET_PRESET
  // initiated from inside the generator, navbar sync MUST NOT wipe out
  // any per-mode palette/semantic edits the user has made — those are
  // distinct user work that survives navbar interactions.
  it('SYNC_PRESET applies new palette only when state still matches the previous preset palette', () => {
    // Diverge the palette in light mode
    const diverged = reducer(DEFAULT_THEME, {
      type: 'SET_PALETTE_STEP',
      mode: 'light',
      group: 'brand',
      step: '500',
      value: '#abcdef',
    })
    // Now navbar tries to sync to a new preset — divergence must survive
    const next = reducer(diverged, { type: 'SYNC_PRESET', preset: 'neon' })
    expect(next.palette.light.brand['500']).toBe('#abcdef')
  })

  it('SYNC_PRESET applies new palette to dark when dark has not been diverged', () => {
    const diverged = reducer(DEFAULT_THEME, {
      type: 'SET_PALETTE_STEP',
      mode: 'light',
      group: 'brand',
      step: '500',
      value: '#abcdef',
    })
    const next = reducer(diverged, { type: 'SYNC_PRESET', preset: 'neon' })
    // Dark was not edited → it follows the new preset
    expect(next.palette.dark.brand['500']).toBe('#7fd321') // neon brand-500
  })

  it('SYNC_PRESET on a fresh theme behaves like SET_PRESET', () => {
    const next = reducer(DEFAULT_THEME, { type: 'SYNC_PRESET', preset: 'sunset' })
    expect(next.palette.light.brand['500']).toBe('#f58a1e')
    expect(next.palette.dark.brand['500']).toBe('#f58a1e')
  })
})
