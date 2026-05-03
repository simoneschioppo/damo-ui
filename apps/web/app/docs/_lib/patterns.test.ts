import { describe, it, expect } from 'vitest'
import { PATTERNS } from './patterns'

describe('PATTERNS', () => {
  it('exposes 8 pattern definitions', () => {
    expect(PATTERNS).toHaveLength(8)
  })

  it('every pattern has a non-empty name', () => {
    PATTERNS.forEach((p) => {
      expect(typeof p.name).toBe('string')
      expect(p.name.length).toBeGreaterThan(0)
    })
  })

  it('every pattern has a unique name', () => {
    const names = PATTERNS.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('includes the expected Memphis set', () => {
    const names = PATTERNS.map((p) => p.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'STRIPES 45°',
        'STRIPES H',
        'DOTS',
        'GRID',
        'CHECKER',
        'WEAVE',
        'WAVES',
        'SCATTER',
      ]),
    )
  })

  it('every pattern has a background string', () => {
    PATTERNS.forEach((p) => {
      expect(typeof p.background).toBe('string')
      expect(p.background.length).toBeGreaterThan(0)
    })
  })
})
