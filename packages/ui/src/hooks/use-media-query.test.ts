import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery, useIsMobile } from './use-media-query'

/**
 * Install a controllable `window.matchMedia` whose `matches` value can be
 * flipped at runtime, firing registered `change` listeners (so we can assert
 * the hook re-renders on viewport changes).
 */
function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mql = {
    get matches() {
      return matches
    },
    media: '',
    onchange: null,
    addEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.add(cb)
    },
    removeEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.delete(cb)
    },
    addListener: (cb: (event: MediaQueryListEvent) => void) => {
      listeners.add(cb)
    },
    removeListener: (cb: (event: MediaQueryListEvent) => void) => {
      listeners.delete(cb)
    },
    dispatchEvent: () => false,
  }
  const fn = vi.fn((query: string) => {
    mql.media = query
    return mql as unknown as MediaQueryList
  })
  window.matchMedia = fn as unknown as typeof window.matchMedia
  return {
    fn,
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent))
    },
  }
}

describe('useMediaQuery', () => {
  it('returns false when the query does not match', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(max-width: 100px)'))
    expect(result.current).toBe(false)
  })

  it('returns true when the query matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useMediaQuery('(max-width: 100px)'))
    expect(result.current).toBe(true)
  })

  it('updates when the media query changes', () => {
    const mm = mockMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(max-width: 100px)'))
    expect(result.current).toBe(false)
    act(() => {
      mm.setMatches(true)
    })
    expect(result.current).toBe(true)
  })

  it('passes the query string through to matchMedia', () => {
    const mm = mockMatchMedia(false)
    renderHook(() => useMediaQuery('(min-width: 900px)'))
    expect(mm.fn).toHaveBeenCalledWith('(min-width: 900px)')
  })
})

describe('useIsMobile', () => {
  it('queries just below the lg breakpoint by default (1024px)', () => {
    const mm = mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
    const query = mm.fn.mock.calls[0]![0] as string
    expect(query).toContain('max-width')
    expect(query).toContain('1023')
  })

  it('maps the md breakpoint to just below 768px', () => {
    const mm = mockMatchMedia(false)
    renderHook(() => useIsMobile('md'))
    const query = mm.fn.mock.calls[0]![0] as string
    expect(query).toContain('767')
  })

  it('maps the sm breakpoint to just below 640px', () => {
    const mm = mockMatchMedia(false)
    renderHook(() => useIsMobile('sm'))
    const query = mm.fn.mock.calls[0]![0] as string
    expect(query).toContain('639')
  })
})
