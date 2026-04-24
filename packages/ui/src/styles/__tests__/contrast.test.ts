import { describe, it, expect } from 'vitest'
import { passesAA } from '../contrast-utils'

/**
 * Body-text pairs — pairs where contrast failure breaks readability of
 * paragraph text, labels, and form inputs. Must pass WCAG AA (≥ 4.5:1).
 *
 * Decorative pairs (primary, secondary, accent, destructive, status,
 * badges) are intentionally NOT tested here — Memphis aesthetic allows
 * lower contrast on large/bold CTAs.
 *
 * See docs/specs/2026-04-24-theme-architecture-refactor-design.md §7.3.
 */

type Pair = readonly [label: string, bg: string, fg: string]

// Default palette — paper + plum + gold raw values
const PAPER_50 = '#fbf7ee'
const PAPER_100 = '#f5efde'
const PLUM_300 = '#c590c9'
const PLUM_700 = '#522357'
const PLUM_800 = '#3d1a40'
const PLUM_900 = '#2a0f2d'
const WHITE = '#ffffff'

// Neon palette raw values
const NEON_PLUM_300 = '#e26dbb'
const NEON_PLUM_700 = '#491a40'
const NEON_PLUM_800 = '#321029'
const NEON_PLUM_900 = '#1f0819'

// Sunset palette raw values
const SUNSET_PLUM_300 = '#dd8a6d'
const SUNSET_PLUM_700 = '#5a2514'
const SUNSET_PLUM_800 = '#3f170d'
const SUNSET_PLUM_900 = '#2a0d07'

describe('semantic contrast — body-text pairs only (WCAG AA, ≥ 4.5:1)', () => {
  describe('default palette — light', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PAPER_50, PLUM_900],
      ['card / card-foreground', WHITE, PLUM_900],
      ['popover / popover-foreground', WHITE, PLUM_900],
      ['muted / muted-foreground', PAPER_100, PLUM_700],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('default palette — dark', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PLUM_900, PAPER_50],
      ['card / card-foreground', PLUM_800, PAPER_50],
      ['popover / popover-foreground', PLUM_800, PAPER_50],
      ['muted / muted-foreground', PLUM_700, PLUM_300],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('neon palette — light', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PAPER_50, NEON_PLUM_900],
      ['card / card-foreground', WHITE, NEON_PLUM_900],
      ['popover / popover-foreground', WHITE, NEON_PLUM_900],
      ['muted / muted-foreground', PAPER_100, NEON_PLUM_700],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('neon palette — dark', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', NEON_PLUM_900, PAPER_50],
      ['card / card-foreground', NEON_PLUM_800, PAPER_50],
      ['popover / popover-foreground', NEON_PLUM_800, PAPER_50],
      ['muted / muted-foreground', NEON_PLUM_700, NEON_PLUM_300],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('sunset palette — light', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PAPER_50, SUNSET_PLUM_900],
      ['card / card-foreground', WHITE, SUNSET_PLUM_900],
      ['popover / popover-foreground', WHITE, SUNSET_PLUM_900],
      ['muted / muted-foreground', PAPER_100, SUNSET_PLUM_700],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('sunset palette — dark', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', SUNSET_PLUM_900, PAPER_50],
      ['card / card-foreground', SUNSET_PLUM_800, PAPER_50],
      ['popover / popover-foreground', SUNSET_PLUM_800, PAPER_50],
      ['muted / muted-foreground', SUNSET_PLUM_700, SUNSET_PLUM_300],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })
})
