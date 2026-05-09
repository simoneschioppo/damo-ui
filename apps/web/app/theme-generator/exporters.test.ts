import { describe, it, expect } from 'vitest'
import { DEFAULT_THEME, computeSemanticDark, type Theme } from './theme-state'
import { buildCssExport, buildJsonExport, buildTailwindExport } from './exporters'

// Helper to build a theme where light vs dark palette/identity diverge.
function withDivergedDark(): Theme {
  const darkPalette = {
    ...DEFAULT_THEME.palette.dark,
    brand: { ...DEFAULT_THEME.palette.dark.brand, '500': '#ff00ff' },
  }
  const darkIdentity = {
    ...DEFAULT_THEME.identity.dark,
    charts: { ...DEFAULT_THEME.identity.dark.charts, '1': '#abcdef' },
  }
  return {
    ...DEFAULT_THEME,
    palette: { ...DEFAULT_THEME.palette, dark: darkPalette },
    identity: { ...DEFAULT_THEME.identity, dark: darkIdentity },
    semantic: { ...DEFAULT_THEME.semantic, dark: computeSemanticDark(darkPalette) },
  }
}

describe('exporters', () => {
  describe('buildCssExport', () => {
    it('emits a :root block with light raw palette and identity tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toContain(':root {')
      expect(css).toContain('--ink-500: #7a3980;')
      expect(css).toContain('--brand-500: #c4942a;')
      expect(css).toContain('--paper-50: #fbf7ee;')
      expect(css).toContain('--medal-bronze-outer: #5a3f20;')
      expect(css).toContain('--chart-1: #7a3980;')
    })

    it('emits :root and :root[data-theme="dark"] for semantic tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toMatch(/:root,\s*:root\[data-theme='light'\] \{[^}]*--background: #fbf7ee;/s)
      expect(css).toMatch(/:root,\s*:root\[data-theme='light'\] \{[^}]*--foreground: #2a0f2d;/s)
      expect(css).toMatch(/:root\[data-theme='dark'\] \{[^}]*--background: #2a0f2d;/s)
      expect(css).toMatch(/:root\[data-theme='dark'\] \{[^}]*--foreground: #fbf7ee;/s)
    })

    it('omits dark palette and identity tokens when they match light', () => {
      // Default theme has identical light/dark palette and identity.
      const css = buildCssExport(DEFAULT_THEME)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).not.toContain('--ink-500:')
      expect(darkBlock).not.toContain('--medal-bronze-outer:')
    })

    it('emits dark palette overrides when light/dark diverge', () => {
      const theme = withDivergedDark()
      const css = buildCssExport(theme)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).toContain('--brand-500: #ff00ff;')
    })

    it('emits dark identity overrides when light/dark diverge', () => {
      const theme = withDivergedDark()
      const css = buildCssExport(theme)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).toContain('--chart-1: #abcdef;')
    })

    it('emits the paired featured badge token', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toContain('--badge-featured: #c4942a;')
      expect(css).toContain('--badge-featured-foreground: #000000;')
    })
  })

  describe('foundations per-mode CSS export', () => {
    it('emits dark-block override for radius.md when light/dark diverge', () => {
      const theme: Theme = {
        ...DEFAULT_THEME,
        radius: {
          light: DEFAULT_THEME.radius.light,
          dark: { ...DEFAULT_THEME.radius.dark, md: 99 },
        },
      }
      const css = buildCssExport(theme)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).toContain('--radius-md: 99px;')
    })

    it('emits dark-block override for typography size when diverged', () => {
      const theme: Theme = {
        ...DEFAULT_THEME,
        typography: {
          light: DEFAULT_THEME.typography.light,
          dark: {
            ...DEFAULT_THEME.typography.dark,
            sizes: { ...DEFAULT_THEME.typography.dark.sizes, base: 22 },
          },
        },
      }
      const css = buildCssExport(theme)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).toContain('--text-base: 22px;')
    })

    it('emits dark-block override for shadowMemphis color when diverged', () => {
      const theme: Theme = {
        ...DEFAULT_THEME,
        shadowMemphis: {
          light: DEFAULT_THEME.shadowMemphis.light,
          dark: {
            ...DEFAULT_THEME.shadowMemphis.dark,
            md: { ...DEFAULT_THEME.shadowMemphis.dark.md, color: '#fafafa' },
          },
        },
      }
      const css = buildCssExport(theme)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).toContain('#fafafa')
    })

    it('does NOT emit dark-block foundations override when light=dark', () => {
      const css = buildCssExport(DEFAULT_THEME)
      const darkBlock = css.split(":root[data-theme='dark']")[1] ?? ''
      expect(darkBlock).not.toContain('--radius-md:')
      expect(darkBlock).not.toContain('--text-base:')
    })
  })

  describe('buildJsonExport', () => {
    it('produces a nested object with light/dark palette and identity', () => {
      const json = JSON.parse(buildJsonExport(DEFAULT_THEME))
      expect(json.palette.light.ink['500']).toBe('#7a3980')
      expect(json.palette.dark.ink['500']).toBe('#7a3980')
      expect(json.semantic.light.background).toBe('#fbf7ee')
      expect(json.semantic.dark.background).toBe('#2a0f2d')
      expect(json.identity.light.medals.gold.inner).toBe('#c4942a')
      expect(json.identity.dark.medals.gold.inner).toBe('#c4942a')
    })
  })

  describe('buildTailwindExport', () => {
    it('emits @theme inline with --color-* bridges for semantic tokens', () => {
      const tw = buildTailwindExport(DEFAULT_THEME)
      expect(tw).toContain('@theme inline')
      expect(tw).toContain('--color-background: var(--background);')
      expect(tw).toContain('--color-primary: var(--primary);')
      expect(tw).toContain('--color-primary-foreground: var(--primary-foreground);')
    })

    it('does NOT emit raw palette as tailwind utilities', () => {
      const tw = buildTailwindExport(DEFAULT_THEME)
      expect(tw).not.toMatch(/--color-ink-\d+:/)
      expect(tw).not.toMatch(/--color-brand-\d+:/)
    })
  })

  describe('buildCssExport with flags', () => {
    it('omits raw palette when flag is false', () => {
      const css = buildCssExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: true,
        semanticDark: true,
        identity: true,
        foundations: true,
      })
      expect(css).not.toMatch(/--ink-\d+:/)
      expect(css).not.toMatch(/--brand-\d+:/)
    })

    it('omits dark block entirely when only opt-ins match between modes', () => {
      // Precondition: with identity=false the only delta emitters left
      // (palette + foundations) match between modes in DEFAULT_THEME, so
      // the dark block has nothing to emit.
      const css = buildCssExport(DEFAULT_THEME, {
        rawPalette: true,
        semanticLight: true,
        semanticDark: false,
        identity: false,
        foundations: true,
      })
      expect(css).not.toContain(":root[data-theme='dark']")
    })

    it('emits dark block with identity-only delta when semantic is off but identity diverges (gh-91)', () => {
      // Post-#91 DEFAULT_IDENTITY_DARK diverges from light (medals.gold.outer
      // moves from ink.900 to paper.50, charts get high-contrast variants,
      // etc.). Even with semanticDark=false the dark block must appear to
      // carry the identity delta — but it must NOT contain semantic tokens.
      const css = buildCssExport(DEFAULT_THEME, {
        rawPalette: true,
        semanticLight: true,
        semanticDark: false,
        identity: true,
        foundations: true,
      })
      const darkMatch = css.match(/:root\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/)
      expect(darkMatch, 'dark block missing').not.toBeNull()
      const darkBody = darkMatch![1]
      expect(darkBody).toContain('--medal-gold-outer:')
      expect(darkBody).toContain('--chart-1:')
      // No semantic tokens should leak through when semanticDark is false.
      expect(darkBody).not.toMatch(/^\s*--background\s*:/m)
      expect(darkBody).not.toMatch(/^\s*--primary\s*:/m)
      expect(darkBody).not.toMatch(/^\s*--warning\s*:/m)
    })

    it('emits foundations when flag is true', () => {
      const css = buildCssExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: false,
        semanticDark: false,
        identity: false,
        foundations: true,
      })
      expect(css).toContain('--text-base:')
      expect(css).toContain('--z-modal:')
      expect(css).toContain('--radius-md:')
      // `selection` is the dedicated radius for selected NavItem / DropdownMenu
      // chrome — must appear in foundations exports so consumers can theme it.
      expect(css).toContain('--radius-selection:')
      // Foundations no longer ship `--radius-lg`, `--shadow-sm/lg`, `--space-N`
      // or `--border-thin/base/thick` — they had zero consumers in the lib.
      expect(css).not.toContain('--radius-lg:')
      expect(css).not.toContain('--shadow-sm:')
      expect(css).not.toContain('--shadow-lg:')
      expect(css).not.toContain('--space-4:')
      expect(css).not.toContain('--border-thin:')
    })

    it('emits nothing when all flags are false', () => {
      const css = buildCssExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: false,
        semanticDark: false,
        identity: false,
        foundations: false,
      })
      expect(css).toBe('')
    })
  })

  describe('buildTailwindExport with flags', () => {
    it('emits text size bridges under foundations', () => {
      const tw = buildTailwindExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: false,
        semanticDark: false,
        identity: false,
        foundations: true,
      })
      expect(tw).toContain('--text-xs:')
      expect(tw).toContain('--text-3xl:')
    })

    it('emits z-index bridges under foundations', () => {
      const tw = buildTailwindExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: false,
        semanticDark: false,
        identity: false,
        foundations: true,
      })
      expect(tw).toMatch(/--z-index-(modal|dropdown|tooltip):/)
    })

    it('omits color bridges when semanticLight flag is false', () => {
      const tw = buildTailwindExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: false,
        semanticDark: false,
        identity: false,
        foundations: false,
      })
      expect(tw).not.toContain('--color-background:')
      expect(tw).not.toContain('--color-primary:')
    })

    it('omits chart and memphis bridges when identity flag is false', () => {
      const tw = buildTailwindExport(DEFAULT_THEME, {
        rawPalette: false,
        semanticLight: false,
        semanticDark: false,
        identity: false,
        foundations: true,
      })
      expect(tw).not.toContain('--color-chart-1:')
      expect(tw).not.toContain('--color-memphis:')
    })
  })
})
