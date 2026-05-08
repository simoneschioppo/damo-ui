import { describe, it as test, expect } from 'vitest'
import { render, renderHook, screen } from '@testing-library/react'
import { I18nProvider, useI18n, useLocale } from '../provider'
import { en } from '../dictionaries'
import type { Dictionary } from '../types'

describe('I18nProvider', () => {
  test('returns English dictionary when no provider is mounted', () => {
    const { result } = renderHook(() => useI18n())
    expect(result.current.spinner.label).toBe('Loading…')
    expect(result.current.dialog.closeLabel).toBe('Close')
  })

  test('returns default locale when no provider is mounted', () => {
    const { result } = renderHook(() => useLocale())
    expect(result.current).toBe('en')
  })

  test('returns Italian dictionary when locale="it"', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider locale="it">{children}</I18nProvider>,
    })
    expect(result.current.spinner.label).toBe('Caricamento…')
    expect(result.current.dialog.closeLabel).toBe('Chiudi')
  })

  test('returns active locale via useLocale', () => {
    const { result } = renderHook(() => useLocale(), {
      wrapper: ({ children }) => <I18nProvider locale="it">{children}</I18nProvider>,
    })
    expect(result.current).toBe('it')
  })

  test('pageOf interpolates page numbers in active locale', () => {
    const { result: en } = renderHook(() => useI18n())
    expect(en.current.pagination.pageOf(2, 7)).toBe('Page 2 of 7')

    const { result: it } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => <I18nProvider locale="it">{children}</I18nProvider>,
    })
    expect(it.current.pagination.pageOf(2, 7)).toBe('Pagina 2 di 7')
  })

  test('explicit dictionary prop overrides bundled translation', () => {
    function Probe() {
      const dict = useI18n()
      return <span data-testid="label">{dict.spinner.label}</span>
    }
    const customDict: Dictionary = {
      ...en,
      spinner: { label: 'Custom…' },
    }
    render(
      <I18nProvider locale="en" dictionary={customDict}>
        <Probe />
      </I18nProvider>,
    )
    expect(screen.getByTestId('label')).toHaveTextContent('Custom…')
  })
})
