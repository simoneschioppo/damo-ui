import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistedAttr } from './use-persisted-attr'

describe('usePersistedAttr', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('returns the default when localStorage is empty', () => {
    const { result } = renderHook(() =>
      usePersistedAttr('theme', 'data-theme', 'light'),
    )
    expect(result.current[0]).toBe('light')
  })

  it('reads initial value from localStorage if present', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() =>
      usePersistedAttr('theme', 'data-theme', 'light'),
    )
    expect(result.current[0]).toBe('dark')
  })

  it('sets data-attribute on html when value changes', () => {
    const { result } = renderHook(() =>
      usePersistedAttr('theme', 'data-theme', 'light'),
    )
    act(() => {
      result.current[1]('dark')
    })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists value to localStorage when changed', () => {
    const { result } = renderHook(() =>
      usePersistedAttr('theme', 'data-theme', 'light'),
    )
    act(() => {
      result.current[1]('dark')
    })
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('sets attribute on mount to synchronize DOM with state', () => {
    localStorage.setItem('theme', 'dark')
    renderHook(() => usePersistedAttr('theme', 'data-theme', 'light'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
