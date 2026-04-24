import { describe, it, expect } from 'vitest'
import { DEFAULT_THEME } from './theme-state'
import { buildCssExport, buildJsonExport, buildTailwindExport, buildFigmaExport } from './exporters'

describe('exporters', () => {
  describe('buildCssExport', () => {
    it('emits a :root block with raw palette and identity tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toContain(':root {')
      expect(css).toContain('--plum-500: #7a3980;')
      expect(css).toContain('--gold-500: #c4942a;')
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
      expect(json.palette.plum['500']).toBe('#7a3980')
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
      expect(tw).not.toMatch(/--color-plum-\d+:/)
      expect(tw).not.toMatch(/--color-gold-\d+:/)
    })
  })

  describe('buildFigmaExport', () => {
    it('produces Tokens Studio format with separate light and dark sets', () => {
      const fig = JSON.parse(buildFigmaExport(DEFAULT_THEME))
      expect(fig.light).toBeDefined()
      expect(fig.dark).toBeDefined()
      expect(fig.light.colors.background.value).toBe('#fbf7ee')
      expect(fig.dark.colors.background.value).toBe('#2a0f2d')
    })
  })
})
