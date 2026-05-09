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
    expect(sem.muted).toBe(DEFAULT_THEME.palette.dark.ink['800'])
  })

  /**
   * gh-91: Plum+Gold dark mode refinement (semantic deltas).
   * See _bmad-output/implementation-artifacts/spec-gh-91-plum-gold-dark-refinement.md.
   */
  describe('gh-91 — dark semantic deltas', () => {
    const sem = computeSemanticDark(DEFAULT_THEME.palette.dark)

    it('muted maps to ink.800 (was ink.700) — tighter step from background', () => {
      expect(sem.muted).toBe(DEFAULT_THEME.palette.dark.ink['800'])
    })

    it('mutedForeground maps to paper.50 (was ink.300) — full-white text on muted by design', () => {
      expect(sem.mutedForeground).toBe(DEFAULT_THEME.palette.dark.paper['50'])
    })

    it('primary maps to brand.400 (was brand.500) — Memphis-shadow legibility on dark plum', () => {
      expect(sem.primary).toBe(DEFAULT_THEME.palette.dark.brand['400'])
    })

    it('ring follows primary (brand.400)', () => {
      expect(sem.ring).toBe(DEFAULT_THEME.palette.dark.brand['400'])
    })

    it('badgeFeatured follows primary (brand.400)', () => {
      expect(sem.badgeFeatured).toBe(DEFAULT_THEME.palette.dark.brand['400'])
    })

    it('warning is decoupled from primary — custom amber #e8a435', () => {
      expect(sem.warning).toBe('#e8a435')
    })

    it('warning !== primary (no-collision invariant)', () => {
      expect(sem.warning).not.toBe(sem.primary)
    })

    it('warning !== success (intent distinction)', () => {
      expect(sem.warning).not.toBe(sem.success)
    })
  })

  /**
   * gh-91: light-mode hierarchy must NOT regress (mutedForeground stays
   * distinct from foreground in light, only dark intentionally collapses).
   */
  describe('gh-91 — light invariants preserved', () => {
    const sem = computeSemanticLight(DEFAULT_THEME.palette.light)

    it('mutedForeground !== foreground in light', () => {
      expect(sem.mutedForeground).not.toBe(sem.foreground)
    })

    it('primary stays at brand.500 in light (only dark shifts)', () => {
      expect(sem.primary).toBe(DEFAULT_THEME.palette.light.brand['500'])
    })
  })
})

/**
 * gh-91: identity is per-mode. The dark identity must not collide with
 * dark-mode bg, and chart/app-pattern colors must read against ink.900.
 */
describe('DEFAULT_THEME.identity — dark deltas (gh-91)', () => {
  const darkId = DEFAULT_THEME.identity.dark
  const darkBg = DEFAULT_THEME.palette.dark.ink['900']

  it('medals.gold.outer is paper.50, not the dark background', () => {
    expect(darkId.medals.gold.outer).toBe(DEFAULT_THEME.palette.dark.paper['50'])
    expect(darkId.medals.gold.outer).not.toBe(darkBg)
  })

  it('medals.master.outer is paper.50, not the dark background', () => {
    expect(darkId.medals.master.outer).toBe(DEFAULT_THEME.palette.dark.paper['50'])
    expect(darkId.medals.master.outer).not.toBe(darkBg)
  })

  it('charts.1 uses ink.300 (high-contrast plum) in dark', () => {
    expect(darkId.charts['1']).toBe(DEFAULT_THEME.palette.dark.ink['300'])
  })

  it('charts.2 uses brand.400 (matches new primary) in dark', () => {
    expect(darkId.charts['2']).toBe(DEFAULT_THEME.palette.dark.brand['400'])
  })

  it('charts.3 uses dark-success #6fa85c in dark', () => {
    expect(darkId.charts['3']).toBe('#6fa85c')
  })

  it('charts.4 uses dark-destructive #c94a2f in dark', () => {
    expect(darkId.charts['4']).toBe('#c94a2f')
  })

  it('charts.5 uses ink.100 (high-contrast pale plum) in dark', () => {
    expect(darkId.charts['5']).toBe(DEFAULT_THEME.palette.dark.ink['100'])
  })

  it('appPattern.color1 uses brand.400 in dark', () => {
    expect(darkId.appPattern.color1).toBe(DEFAULT_THEME.palette.dark.brand['400'])
  })

  it('appPattern.color2 uses ink.300 in dark', () => {
    expect(darkId.appPattern.color2).toBe(DEFAULT_THEME.palette.dark.ink['300'])
  })

  it('appPattern.color3 uses ink.500 in dark', () => {
    expect(darkId.appPattern.color3).toBe(DEFAULT_THEME.palette.dark.ink['500'])
  })

  it('navOnDark stays unchanged (designed for dark surfaces in any mode)', () => {
    expect(darkId.navOnDark).toEqual(DEFAULT_THEME.identity.light.navOnDark)
  })
})

describe('applyPreset', () => {
  it('updates both palette modes and semantic when switching to neon', () => {
    const updated = applyPreset(DEFAULT_THEME, 'neon')
    // Both palette modes switched
    expect(updated.palette.light.brand['500']).toBe('#7fd321')
    expect(updated.palette.dark.brand['500']).toBe('#7fd321')
    // Semantic re-derived from neon palette
    // Light primary = brand.500; dark primary = brand.400 (gh-91).
    expect(updated.semantic.light.primary).toBe('#7fd321')
    expect(updated.semantic.dark.primary).toBe('#9be04a')
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
