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
})
