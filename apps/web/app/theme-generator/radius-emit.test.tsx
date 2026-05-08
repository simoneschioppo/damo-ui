import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useThemeState } from './use-theme-state'

/**
 * Issue #63 — `--radius-pill` and `--radius-full` were forced to the
 * constants `999px` / `50%` by `emitFoundationsVars`, ignoring user input.
 * This test asserts the emitter now propagates the user's numeric value
 * for both keys (with `px` unit for pill, `%` for full to preserve
 * scale-aware semantics).
 */
describe('Issue #63 — radius pill/full emitter honors user input', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.documentElement.removeAttribute('data-palette')
  })

  function readOverrideStylesheet(): string {
    const style = document.getElementById('theme-generator-overrides') as HTMLStyleElement | null
    return style?.textContent ?? ''
  }

  it('propagates --radius-pill numeric edits as <N>px (was hard-coded 999px)', () => {
    const { result } = renderHook(() => useThemeState())
    act(() => {
      result.current.dispatch({ type: 'SET_RADIUS', mode: 'light', key: 'pill', value: 200 })
      result.current.dispatch({ type: 'SET_RADIUS', mode: 'dark', key: 'pill', value: 200 })
    })
    const css = readOverrideStylesheet()
    // Both light + dark blocks should carry the new value (no leftover 999).
    expect(css).toMatch(/--radius-pill:\s*200px;/)
    expect(css).not.toMatch(/--radius-pill:\s*999px;/)
  })

  it('propagates --radius-full numeric edits as <N>% (was hard-coded 50%)', () => {
    const { result } = renderHook(() => useThemeState())
    act(() => {
      result.current.dispatch({ type: 'SET_RADIUS', mode: 'light', key: 'full', value: 25 })
      result.current.dispatch({ type: 'SET_RADIUS', mode: 'dark', key: 'full', value: 25 })
    })
    const css = readOverrideStylesheet()
    expect(css).toMatch(/--radius-full:\s*25%;/)
    expect(css).not.toMatch(/--radius-full:\s*50%;/)
  })

  it('preserves the default values when user has not edited', () => {
    renderHook(() => useThemeState())
    const css = readOverrideStylesheet()
    // DEFAULT_RADIUS has pill=999 and full=50 — both should still emit
    // their canonical default forms after the fix.
    expect(css).toMatch(/--radius-pill:\s*999px;/)
    expect(css).toMatch(/--radius-full:\s*50%;/)
  })

  it('propagates --radius-md and --radius-sm edits unchanged (regression guard)', () => {
    const { result } = renderHook(() => useThemeState())
    act(() => {
      result.current.dispatch({ type: 'SET_RADIUS', mode: 'light', key: 'md', value: 8 })
      result.current.dispatch({ type: 'SET_RADIUS', mode: 'light', key: 'sm', value: 3 })
    })
    const css = readOverrideStylesheet()
    expect(css).toMatch(/--radius-md:\s*8px;/)
    expect(css).toMatch(/--radius-sm:\s*3px;/)
  })
})
