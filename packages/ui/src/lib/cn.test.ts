import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(cn('foo', false, null, undefined, '', 'bar')).toBe('foo bar')
  })

  it('handles conditional objects (clsx)', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
  })

  it('handles arrays (clsx)', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('merges conflicting tailwind classes keeping the last (tailwind-merge)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('merges conflicting color utilities', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('returns empty string when nothing passed', () => {
    expect(cn()).toBe('')
  })

  // The lib's per-color Memphis shadows (#66) are custom @utility blocks
  // that `tailwind-merge`'s default config treats as opaque — without the
  // `extendTailwindMerge` registration in cn.ts, a consumer-supplied
  // `shadow-none` or a sibling `shadow-memphis-*` class would coexist
  // with the lib's tinted shadow and leave last-wins source order to
  // decide which paints. These cases lock that registration in.
  describe('Memphis-shadow conflict resolution (#66)', () => {
    it('a consumer-supplied shadow-none collapses the lib tinted shadow', () => {
      expect(cn('shadow-memphis-primary', 'shadow-none')).toBe('shadow-none')
    })

    it('cross-tier collisions resolve to the last class', () => {
      expect(cn('shadow-memphis', 'shadow-memphis-lg-destructive')).toBe(
        'shadow-memphis-lg-destructive',
      )
    })

    it('per-color and bare tier collide; last wins', () => {
      expect(cn('shadow-memphis', 'shadow-memphis-primary')).toBe('shadow-memphis-primary')
    })

    it('hover-prefixed shadows do not collide with rest-state shadows', () => {
      // Different state scopes — both should survive.
      const out = cn('shadow-memphis-primary', 'hover:shadow-memphis-primary-hover')
      expect(out).toContain('shadow-memphis-primary')
      expect(out).toContain('hover:shadow-memphis-primary-hover')
    })

    it('hover-prefixed shadows collide within the hover scope', () => {
      expect(cn('hover:shadow-memphis-hover', 'hover:shadow-memphis-primary-hover')).toBe(
        'hover:shadow-memphis-primary-hover',
      )
    })
  })
})
