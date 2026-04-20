import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useResolvedCssVars } from './use-resolved-css-vars'

describe('useResolvedCssVars', () => {
  beforeEach(() => {
    document.documentElement.style.setProperty('--plum-500', '#6d2f6a')
    document.documentElement.style.setProperty('--gold-500', '#d9a441')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-palette')
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--plum-500')
    document.documentElement.style.removeProperty('--gold-500')
  })

  it('returns an object keyed by the requested var names', async () => {
    const { result } = renderHook(() => useResolvedCssVars(['--plum-500', '--gold-500']))
    await waitFor(() => {
      expect(Object.keys(result.current)).toEqual(
        expect.arrayContaining(['--plum-500', '--gold-500']),
      )
    })
  })

  it('reads initial values from document.documentElement computed style', async () => {
    const { result } = renderHook(() => useResolvedCssVars(['--plum-500']))
    await waitFor(() => {
      expect(result.current['--plum-500']).toBe('#6d2f6a')
    })
  })

  it('returns an empty object when given an empty array', () => {
    const { result } = renderHook(() => useResolvedCssVars([]))
    expect(result.current).toEqual({})
  })

  it('re-reads values when data-theme attribute changes', async () => {
    const { result } = renderHook(() => useResolvedCssVars(['--plum-500']))
    await waitFor(() => {
      expect(result.current['--plum-500']).toBe('#6d2f6a')
    })

    act(() => {
      document.documentElement.style.setProperty('--plum-500', '#123456')
      document.documentElement.setAttribute('data-theme', 'dark')
    })

    await waitFor(() => {
      expect(result.current['--plum-500']).toBe('#123456')
    })
  })

  it('re-reads values when data-palette attribute changes', async () => {
    const { result } = renderHook(() => useResolvedCssVars(['--gold-500']))
    await waitFor(() => {
      expect(result.current['--gold-500']).toBe('#d9a441')
    })

    act(() => {
      document.documentElement.style.setProperty('--gold-500', '#abcdef')
      document.documentElement.setAttribute('data-palette', 'alt')
    })

    await waitFor(() => {
      expect(result.current['--gold-500']).toBe('#abcdef')
    })
  })

  it('updates the returned map when the list of names changes', async () => {
    const { result, rerender } = renderHook(
      ({ names }: { names: ReadonlyArray<string> }) => useResolvedCssVars(names),
      { initialProps: { names: ['--plum-500'] } },
    )
    await waitFor(() => {
      expect(result.current['--plum-500']).toBe('#6d2f6a')
    })

    rerender({ names: ['--gold-500'] })
    await waitFor(() => {
      expect(result.current['--gold-500']).toBe('#d9a441')
    })
  })
})
