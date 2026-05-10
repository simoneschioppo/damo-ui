import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistedAttr } from './use-persisted-attr'

describe('usePersistedAttr', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-palette')
    document.documentElement.removeAttribute('data-density')
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

  it('lazy-inits: writes storage value once, never the default first', () => {
    // Regression for the locale-switch theme flash. Under the previous
    // `useState(defaultValue)` + post-paint useEffect implementation, the
    // DOM-write effect fired with `value = defaultValue` first, calling
    // setAttribute('data-theme', 'light') — visible flash — before the
    // storage-read effect updated state and the DOM-write effect re-fired
    // with 'dark'. Spying on setAttribute proves the new behaviour: exactly
    // one write, with the storage value.
    localStorage.setItem('theme', 'dark')
    const writes: string[] = []
    const original = document.documentElement.setAttribute.bind(document.documentElement)
    document.documentElement.setAttribute = (name: string, value: string) => {
      if (name === 'data-theme') writes.push(value)
      original(name, value)
    }
    try {
      renderHook(() => usePersistedAttr<'light' | 'dark'>('theme', 'data-theme', 'light'))
      expect(writes).toEqual(['dark'])
    } finally {
      document.documentElement.setAttribute = original
    }
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
