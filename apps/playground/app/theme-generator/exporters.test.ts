import { describe, it, expect } from 'vitest'
import { DEFAULT_THEME } from './theme-state'
import { buildCssExport, buildJsonExport, buildTailwindExport } from './exporters'

describe('exporters', () => {
  describe('buildCssExport', () => {
    it('emits a :root block with raw palette and identity tokens', () => {
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
      // Light block
      expect(css).toMatch(/:root,\s*:root\[data-theme='light'\] \{[^}]*--background: #fbf7ee;/s)
      expect(css).toMatch(/:root,\s*:root\[data-theme='light'\] \{[^}]*--foreground: #2a0f2d;/s)
      // Dark block
      expect(css).toMatch(/:root\[data-theme='dark'\] \{[^}]*--background: #2a0f2d;/s)
      expect(css).toMatch(/:root\[data-theme='dark'\] \{[^}]*--foreground: #fbf7ee;/s)
    })

    it('emits paired badge tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toContain('--badge-navy: #2a0f2d;')
      expect(css).toContain('--badge-navy-foreground: #f0d49a;')
    })
  })

  describe('buildJsonExport', () => {
    it('produces a nested object matching the three-layer shape', () => {
      const json = JSON.parse(buildJsonExport(DEFAULT_THEME))
      expect(json.palette.ink['500']).toBe('#7a3980')
      expect(json.semantic.light.background).toBe('#fbf7ee')
      expect(json.semantic.dark.background).toBe('#2a0f2d')
      expect(json.identity.medals.gold.inner).toBe('#c4942a')
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

    it('omits dark semantic block when flag is false', () => {
      const css = buildCssExport(DEFAULT_THEME, {
        rawPalette: true,
        semanticLight: true,
        semanticDark: false,
        identity: true,
        foundations: true,
      })
      expect(css).not.toContain(":root[data-theme='dark']")
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
      expect(css).toContain('--space-4:')
      expect(css).toContain('--z-modal:')
      expect(css).toContain('--radius-lg:')
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
