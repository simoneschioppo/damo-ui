import { describe, it, expect } from 'vitest'
import { hexToRgb, relativeLuminance, contrastRatio, passesAA } from '../contrast-utils'

describe('contrast-utils', () => {
  describe('hexToRgb', () => {
    it('parses 6-char hex', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb('#c4942a')).toEqual({ r: 196, g: 148, b: 42 })
    })

    it('parses 3-char hex', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('is case-insensitive', () => {
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
    })
  })

  describe('relativeLuminance', () => {
    it('returns 1.0 for white', () => {
      expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1.0, 3)
    })

    it('returns 0.0 for black', () => {
      expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0.0, 3)
    })
  })

  describe('contrastRatio', () => {
    it('returns 21 for black on white', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21.0, 1)
    })

    it('returns 1 for same color', () => {
      expect(contrastRatio('#c4942a', '#c4942a')).toBeCloseTo(1.0, 3)
    })

    it('is commutative', () => {
      expect(contrastRatio('#000', '#fff')).toBeCloseTo(contrastRatio('#fff', '#000'), 3)
    })
  })

  describe('passesAA', () => {
    it('passes black on white', () => {
      expect(passesAA('#000000', '#ffffff')).toBe(true)
    })

    it('fails gold on white', () => {
      expect(passesAA('#c4942a', '#ffffff')).toBe(false)
    })

    it('passes black on gold', () => {
      expect(passesAA('#000000', '#c4942a')).toBe(true)
    })
  })
})
