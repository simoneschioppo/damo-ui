import { describe, it, expect } from 'vitest'
import { BRAND } from './brand'

describe('BRAND', () => {
  it('exposes the underlying library name', () => {
    expect(BRAND.libName).toBe('Damo UI')
  })

  it('points the mascot at the public asset', () => {
    expect(BRAND.mascotSrc).toBe('/mascot.png')
    expect(BRAND.mascotWidth).toBeGreaterThan(0)
    expect(BRAND.mascotHeight).toBeGreaterThan(0)
  })

  it('describes the mascot for assistive tech', () => {
    expect(BRAND.mascotAlt).toBeTypeOf('string')
    expect(BRAND.mascotAlt.length).toBeGreaterThan(0)
  })

  it('exposes a tagline for hero/meta usage', () => {
    expect(BRAND.tagline).toBeTypeOf('string')
    expect(BRAND.tagline.length).toBeGreaterThan(0)
  })

  it('exposes the upstream repo url', () => {
    expect(BRAND.repoUrl).toMatch(/^https:\/\//)
  })
})
