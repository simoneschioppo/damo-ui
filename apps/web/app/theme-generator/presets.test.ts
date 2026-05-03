import { describe, it, expect } from 'vitest'
import { applyPreset } from './presets'
import { DEFAULT_THEME, computeSemanticLight, computeSemanticDark } from './theme-state'

describe('computeSemanticLight', () => {
  it('derives semantic colors from a palette using the canonical mapping', () => {
    const sem = computeSemanticLight(DEFAULT_THEME.palette.light)
    expect(sem.background).toBe(DEFAULT_THEME.palette.light.paper['50'])
    expect(sem.foreground).toBe(DEFAULT_THEME.palette.light.ink['900'])
    expect(sem.primary).toBe(DEFAULT_THEME.palette.light.brand['500'])
    expect(sem.secondary).toBe(DEFAULT_THEME.palette.light.ink['500'])
    expect(sem.muted).toBe(DEFAULT_THEME.palette.light.paper['100'])
    expect(sem.mutedForeground).toBe(DEFAULT_THEME.palette.light.ink['700'])
  })
})

describe('computeSemanticDark', () => {
  it('derives semantic dark colors using the canonical mapping', () => {
    const sem = computeSemanticDark(DEFAULT_THEME.palette.dark)
    expect(sem.background).toBe(DEFAULT_THEME.palette.dark.ink['900'])
    expect(sem.foreground).toBe(DEFAULT_THEME.palette.dark.paper['50'])
    expect(sem.card).toBe(DEFAULT_THEME.palette.dark.ink['800'])
    expect(sem.muted).toBe(DEFAULT_THEME.palette.dark.ink['700'])
  })
})

describe('applyPreset', () => {
  it('updates both palette modes and semantic when switching to neon', () => {
    const updated = applyPreset(DEFAULT_THEME, 'neon')
    // Both palette modes switched
    expect(updated.palette.light.brand['500']).toBe('#7fd321')
    expect(updated.palette.dark.brand['500']).toBe('#7fd321')
    // Semantic re-derived from neon palette
    expect(updated.semantic.light.primary).toBe('#7fd321')
    expect(updated.semantic.dark.primary).toBe('#7fd321')
    // Identity preserved (medals, charts, navOnDark, fonts)
    expect(updated.identity).toEqual(DEFAULT_THEME.identity)
    expect(updated.typography).toEqual(DEFAULT_THEME.typography)
    expect(updated.radius).toEqual(DEFAULT_THEME.radius)
  })

  it('returns to default when preset is "default"', () => {
    const sun = applyPreset(DEFAULT_THEME, 'sunset')
    const back = applyPreset(sun, 'default')
    expect(back.palette).toEqual(DEFAULT_THEME.palette)
    expect(back.semantic.light.primary).toBe(DEFAULT_THEME.palette.light.brand['500'])
  })
})
