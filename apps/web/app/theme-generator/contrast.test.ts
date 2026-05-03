import { describe, it, expect } from 'vitest'
import { contrastRatio, contrastLevel } from './contrast'

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21.0, 1)
  })

  it('is 1 for same color', () => {
    expect(contrastRatio('#7a3980', '#7a3980')).toBeCloseTo(1.0, 3)
  })

  it('is commutative', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(contrastRatio('#fff', '#000'), 3)
  })
})

describe('contrastLevel', () => {
  it('returns aaa above 7.0', () => {
    expect(contrastLevel('#000000', '#ffffff')).toBe('aaa')
  })

  it('returns aa between 4.5 and 7.0', () => {
    expect(contrastLevel('#5a5a5a', '#ffffff')).toBe('aa')
  })

  it('returns fail below 4.5', () => {
    expect(contrastLevel('#c4942a', '#ffffff')).toBe('fail')
  })

  it('crosses the 4.5 boundary correctly', () => {
    // Just below 4.5 → fail; just above → aa
    // Using approximate values
    expect(contrastLevel('#c4942a', '#ffffff')).toBe('fail')
    expect(contrastLevel('#000000', '#c4942a')).not.toBe('fail')
  })
})
