import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistedAttr } from './use-persisted-attr'

describe('usePersistedAttr', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('theme')
  })

  it('returns the default when localStorage is empty', () => {
    const { result } = renderHook(() =>
      usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'),
    )
    expect(result.current[0]).toBe('light')
  })

  it('reads initial value from localStorage if present', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() =>
      usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'),
    )
    expect(result.current[0]).toBe('dark')
  })

  it('sets data-attribute on html when value changes', () => {
    const { result } = renderHook(() =>
      usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'),
    )
    act(() => {
      result.current[1]('dark')
    })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists value to localStorage when changed', () => {
    const { result } = renderHook(() =>
      usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'),
    )
    act(() => {
      result.current[1]('dark')
    })
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('sets attribute on mount to synchronize DOM with state', () => {
    localStorage.setItem('theme', 'dark')
    renderHook(() => usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('lazy-inits state from localStorage on the first render (no flash)', () => {
    // Regression for the locale-switch theme flash: with `useState(defaultValue)`
    // the first render returned the default and a post-paint effect would later
    // write the wrong attribute, then re-render with the storage value. Lazy
    // init makes the first render value match storage so the DOM-write effect
    // is a no-op instead of an undo. Asserting `result.current[0]` is observed
    // SYNCHRONOUSLY after `renderHook` would still be `'light'` under the old
    // double-pass behaviour — we capture state during the render itself via a
    // ref to prove the initializer (not an effect) populated it.
    localStorage.setItem('theme', 'dark')
    let firstRenderValue: string | undefined
    renderHook(() => {
      const [value] = usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light')
      if (firstRenderValue === undefined) firstRenderValue = value
      return value
    })
    expect(firstRenderValue).toBe('dark')
  })

  it('falls back to defaultValue when localStorage.getItem throws', () => {
    const original = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new Error('storage unavailable')
    }
    try {
      const { result } = renderHook(() =>
        usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'),
      )
      expect(result.current[0]).toBe('light')
    } finally {
      Storage.prototype.getItem = original
    }
  })
})
