import { describe, it, expect } from 'vitest'
import { sanitizeHref } from './safe-href'

describe('sanitizeHref', () => {
  it('passes through absolute http(s) URLs', () => {
    expect(sanitizeHref('https://example.com')).toBe('https://example.com')
    expect(sanitizeHref('http://example.com')).toBe('http://example.com')
  })

  it('passes through relative + root-relative URLs', () => {
    expect(sanitizeHref('/docs/components/button')).toBe('/docs/components/button')
    expect(sanitizeHref('./relative')).toBe('./relative')
    expect(sanitizeHref('../parent')).toBe('../parent')
    expect(sanitizeHref('#section')).toBe('#section')
  })

  it('passes through protocol-relative + mailto + tel', () => {
    expect(sanitizeHref('//cdn.example.com/asset')).toBe('//cdn.example.com/asset')
    expect(sanitizeHref('mailto:foo@bar.com')).toBe('mailto:foo@bar.com')
    expect(sanitizeHref('tel:+1234567890')).toBe('tel:+1234567890')
  })

  it('returns undefined for javascript: URIs', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBeUndefined()
    expect(sanitizeHref('JavaScript:alert(1)')).toBeUndefined()
    expect(sanitizeHref('  javascript:void(0)  ')).toBeUndefined()
    expect(sanitizeHref('\tjavascript:alert(1)')).toBeUndefined()
  })

  it('returns undefined for data: URIs', () => {
    expect(sanitizeHref('data:text/html,<script>alert(1)</script>')).toBeUndefined()
    expect(sanitizeHref('DATA:image/png;base64,xyz')).toBeUndefined()
  })

  it('returns undefined for vbscript: URIs', () => {
    expect(sanitizeHref('vbscript:msgbox(1)')).toBeUndefined()
    expect(sanitizeHref('VBScript:Execute')).toBeUndefined()
  })

  it('returns undefined when href is undefined', () => {
    expect(sanitizeHref(undefined)).toBeUndefined()
  })

  it('passes through empty string (consumer choice)', () => {
    expect(sanitizeHref('')).toBe('')
  })
})
