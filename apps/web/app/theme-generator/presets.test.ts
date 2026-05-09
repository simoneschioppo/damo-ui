import { describe, it, expect } from 'vitest'
import { applyPreset, PRESET_NAMES, PRESET_LABELS } from './presets'
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

    it('background stays at ink.900 — never collides with card/muted in dark', () => {
      expect(sem.background).toBe(DEFAULT_THEME.palette.dark.ink['900'])
      expect(sem.card).not.toBe(sem.background)
    })

    it('muted maps to ink.800 (was ink.700) — tighter step from background', () => {
      expect(sem.muted).toBe(DEFAULT_THEME.palette.dark.ink['800'])
    })

    it('muted == card in dark — deliberate flat-stack design (gh-91 review HIGH-1)', () => {
      expect(sem.muted).toBe(sem.card)
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

    it('memphisShadowColor stays black; memphisBorderColor lifts to #cccccc (frame visibility on dark plum)', () => {
      expect(sem.memphisShadowColor).toBe('#000000')
      expect(sem.memphisBorderColor).toBe('#cccccc')
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
  it('updates both palette modes and semantic when switching to cyberpunk', () => {
    const updated = applyPreset(DEFAULT_THEME, 'cyberpunk')
    expect(updated.palette.light.brand['500']).toBe('#ffab00')
    expect(updated.palette.dark.brand['500']).toBe('#ffab00')
    expect(updated.semantic.light.primary).toBe('#ffab00')
    // dark primary = brand.400 (gh-91 dark mapping)
    expect(updated.semantic.dark.primary).toBe('#ffc107')
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

/**
 * gh-93: preset roster after Neon → Cyberpunk + Forest swap.
 * See _bmad-output/implementation-artifacts/spec-gh-93-palette-refresh-r2.md.
 */
describe('gh-93 — preset roster', () => {
  it('PRESET_NAMES enumerates the four built-in presets in canonical order', () => {
    expect(PRESET_NAMES).toEqual(['default', 'sunset', 'cyberpunk', 'forest'])
  })

  it('PRESET_LABELS has a label for every preset', () => {
    PRESET_NAMES.forEach((name) => {
      expect(PRESET_LABELS[name]).toBeTruthy()
    })
  })

  it('Neon is no longer in PRESET_NAMES', () => {
    expect(PRESET_NAMES as readonly string[]).not.toContain('neon')
  })
})

/**
 * gh-93: Cyberpunk palette + light-mode primaryForeground override.
 * The vivid amber `brand.500 = #ffab00` fails WCAG AA against white text;
 * the override forces dark text (`ink.900 = #170731`) for legibility.
 */
describe('gh-93 — Cyberpunk palette + override', () => {
  const cy = applyPreset(DEFAULT_THEME, 'cyberpunk')

  it('ink scale matches the cyberpunk violet ramp', () => {
    expect(cy.palette.light.ink).toEqual({
      '100': '#f0d4ff',
      '300': '#b388ff',
      '500': '#7c4dff',
      '700': '#3d1c75',
      '800': '#2a1052',
      '900': '#170731',
    })
  })

  it('brand scale matches the cyberpunk amber ramp', () => {
    expect(cy.palette.light.brand).toEqual({
      '100': '#fff4b3',
      '200': '#ffe57a',
      '300': '#ffd740',
      '400': '#ffc107',
      '500': '#ffab00',
    })
  })

  it('light primaryForeground is overridden to ink.900 (#170731) — vivid amber needs dark text', () => {
    expect(cy.semantic.light.primaryForeground).toBe('#170731')
  })

  it('dark primaryForeground stays ink.900 from canonical dark mapping', () => {
    expect(cy.semantic.dark.primaryForeground).toBe('#170731')
  })

  it('memphisBorderColor in dark stays the gh-91 default (#cccccc) — only sunset overrides', () => {
    expect(cy.semantic.dark.memphisBorderColor).toBe('#cccccc')
  })

  it('palette is mirrored across light and dark modes (preset reset behavior)', () => {
    expect(cy.palette.dark).toEqual(cy.palette.light)
  })

  it('semantic.dark equals canonical computeSemanticDark — light override does not bleed to dark', () => {
    // Regression guard: if someone adds a dark override under cyberpunk by
    // mistake, this asserts the dark mode stays purely on the canonical path.
    expect(cy.semantic.dark).toEqual(computeSemanticDark(cy.palette.dark))
  })
})

/**
 * gh-93: Forest palette — no semantic overrides; the canonical mapping
 * produces a WCAG-AA result with white text on `brand.500 = #a8590e`.
 */
describe('gh-93 — Forest palette (no overrides)', () => {
  const fo = applyPreset(DEFAULT_THEME, 'forest')

  it('ink scale matches the forest green ramp', () => {
    expect(fo.palette.light.ink).toEqual({
      '100': '#d6ead2',
      '300': '#8cbf85',
      '500': '#2f6b3b',
      '700': '#1d4226',
      '800': '#14301c',
      '900': '#0c1f12',
    })
  })

  it('brand scale matches the forest amber ramp', () => {
    expect(fo.palette.light.brand).toEqual({
      '100': '#fde6b8',
      '200': '#f7d28a',
      '300': '#f0bb55',
      '400': '#e6a02e',
      '500': '#a8590e',
    })
  })

  it('light primaryForeground is white (canonical mapping; brand.500 #a8590e contrasts AA)', () => {
    expect(fo.semantic.light.primaryForeground).toBe('#ffffff')
  })

  it('memphisBorderColor in dark stays the gh-91 default (#cccccc) — no preset override for forest', () => {
    expect(fo.semantic.dark.memphisBorderColor).toBe('#cccccc')
  })

  it('semantic.light equals canonical computeSemanticLight — no overrides applied for forest', () => {
    expect(fo.semantic.light).toEqual(computeSemanticLight(fo.palette.light))
  })

  it('semantic.dark equals canonical computeSemanticDark — no overrides applied for forest', () => {
    expect(fo.semantic.dark).toEqual(computeSemanticDark(fo.palette.dark))
  })
})

/**
 * gh-93: Sunset semantic override — keep the black Memphis border in dark.
 * The gh-91 lift to #cccccc was sized for plum/gold, not terracotta.
 */
describe('gh-93 — Sunset semantic override (memphis border)', () => {
  const sun = applyPreset(DEFAULT_THEME, 'sunset')

  it('dark.memphisBorderColor is overridden to #000000 (was #cccccc post-gh-91)', () => {
    expect(sun.semantic.dark.memphisBorderColor).toBe('#000000')
  })

  it('light.memphisBorderColor remains the canonical light default (#000000)', () => {
    expect(sun.semantic.light.memphisBorderColor).toBe('#000000')
  })

  it('non-overridden dark tokens follow the canonical mapping (primary = brand.400 of sunset palette)', () => {
    expect(sun.semantic.dark.primary).toBe('#fda047')
  })

  it('non-overridden dark tokens follow the canonical mapping (memphisShadowColor stays black)', () => {
    expect(sun.semantic.dark.memphisShadowColor).toBe('#000000')
  })
})
