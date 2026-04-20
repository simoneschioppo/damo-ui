import { describe, expect, it } from 'vitest'
import {
  buildCssExport,
  buildTailwindExport,
  buildJsonExport,
  buildFigmaExport,
} from './exporters'
import { DEFAULT_THEME } from './theme-state'

describe('buildCssExport', () => {
  it('emits a :root block with the theme color tokens as CSS vars', () => {
    const out = buildCssExport(DEFAULT_THEME)
    expect(out).toContain(':root {')
    expect(out).toContain('--plum-500: #7a3980;')
    expect(out).toContain('--gold-500: #c4942a;')
    expect(out).toContain('--paper-50: #fbf7ee;')
  })

  it('includes typography tokens (font families and sizes)', () => {
    const out = buildCssExport(DEFAULT_THEME)
    expect(out).toContain("--font-display: 'Audiowide', system-ui, sans-serif;")
    expect(out).toContain('--font-body:')
    expect(out).toContain('--text-base: 16px;')
  })

  it('includes radius, shadow, spacing, and motion tokens', () => {
    const out = buildCssExport(DEFAULT_THEME)
    expect(out).toContain('--radius-md: 4px;')
    expect(out).toContain('--shadow-memphis: 6px 6px 0')
    expect(out).toContain('--space-4: 16px;')
    expect(out).toContain('--duration-base: 200ms;')
    expect(out).toContain('--ease-memphis: cubic-bezier(')
    expect(out).toMatch(/\}\s*$/)
  })
})

describe('buildTailwindExport', () => {
  it('emits a valid tailwind preset module', () => {
    const out = buildTailwindExport(DEFAULT_THEME)
    expect(out).toContain('export default')
    expect(out).toContain('theme:')
    expect(out).toContain('extend:')
  })

  it('maps theme colors via CSS var() references (not raw hex)', () => {
    const out = buildTailwindExport(DEFAULT_THEME)
    expect(out).toContain("'plum-500': 'var(--plum-500)'")
    expect(out).toContain("'gold-500': 'var(--gold-500)'")
    expect(out).toContain("'paper-50': 'var(--paper-50)'")
  })

  it('exposes fontFamily, borderRadius, and boxShadow under theme.extend', () => {
    const out = buildTailwindExport(DEFAULT_THEME)
    expect(out).toContain('fontFamily:')
    expect(out).toContain('borderRadius:')
    expect(out).toContain('boxShadow:')
  })

  it('emits fontFamily as plain CSS var strings (not runtime-executing .split calls)', () => {
    const out = buildTailwindExport(DEFAULT_THEME)
    expect(out).toContain("display: 'var(--font-display)'")
    expect(out).toContain("body: 'var(--font-body)'")
    expect(out).toContain("mono: 'var(--font-mono)'")
    expect(out).not.toContain('.split(')
  })
})

describe('buildJsonExport', () => {
  it('returns pretty-printed JSON with 2-space indent', () => {
    const out = buildJsonExport(DEFAULT_THEME)
    expect(out.startsWith('{\n  ')).toBe(true)
    expect(out.endsWith('}')).toBe(true)
  })

  it('contains flattened dot-path keys for all token groups', () => {
    const parsed = JSON.parse(buildJsonExport(DEFAULT_THEME)) as Record<string, unknown>
    expect(parsed['colors.plum-500']).toBe('#7a3980')
    expect(parsed['colors.gold-500']).toBe('#c4942a')
    expect(parsed['radius.md']).toBe(4)
    expect(parsed['typography.fontDisplay']).toContain('Audiowide')
    expect(parsed['motion.durations.base']).toBe(200)
    expect(parsed['spacing.scale']).toBe(1)
  })
})

describe('buildFigmaExport', () => {
  it('produces the Figma Tokens Studio JSON shape under "global"', () => {
    const out = buildFigmaExport(DEFAULT_THEME)
    const parsed = JSON.parse(out) as {
      global: {
        color: Record<string, { value: string; type: string }>
        typography?: Record<string, { value: string; type: string }>
        radius?: Record<string, { value: string; type: string }>
      }
    }
    expect(parsed.global).toBeDefined()
    expect(parsed.global.color['plum-500']).toEqual({
      value: '#7a3980',
      type: 'color',
    })
    expect(parsed.global.color['gold-500']?.type).toBe('color')
  })

  it('includes typography, radius, spacing, and motion groups with typed tokens', () => {
    const parsed = JSON.parse(buildFigmaExport(DEFAULT_THEME)) as {
      global: Record<string, Record<string, { value: unknown; type: string }>>
    }
    expect(parsed.global.typography?.fontDisplay?.type).toBe('fontFamilies')
    expect(parsed.global.radius?.md?.type).toBe('borderRadius')
    expect(parsed.global.radius?.md?.value).toBe('4px')
    expect(parsed.global.spacing?.scale?.type).toBe('sizing')
    expect(parsed.global.motion?.['duration-base']?.type).toBe('other')
  })
})
