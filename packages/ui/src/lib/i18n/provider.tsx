'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { dictionaries } from './dictionaries'
import { DEFAULT_LOCALE, type Dictionary, type Locale } from './types'

interface I18nContextValue {
  readonly locale: Locale
  readonly dict: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

export interface I18nProviderProps {
  readonly locale?: Locale
  readonly dictionary?: Dictionary
  readonly children: ReactNode
}

/**
 * Wraps a subtree so all damo-ui components render their default user-facing
 * strings under the chosen locale. Without this provider components fall
 * back to the English dictionary — never throw.
 *
 * Pass `dictionary` to override the bundled translation for the active
 * locale (advanced use; v1 keeps the prop for forward-compat but most
 * consumers only need `locale`).
 */
export function I18nProvider({
  locale = DEFAULT_LOCALE,
  dictionary,
  children,
}: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, dict: dictionary ?? dictionaries[locale] }),
    [locale, dictionary],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Returns the active dictionary. Falls back to the English dictionary when
 * no `<I18nProvider>` is mounted — components must remain functional in
 * bare React trees (Ladle stories, external consumers without provider).
 */
export function useI18n(): Dictionary {
  const ctx = useContext(I18nContext)
  return ctx?.dict ?? dictionaries[DEFAULT_LOCALE]
}

/**
 * Returns the active locale string. Falls back to the default locale when
 * no `<I18nProvider>` is mounted.
 */
export function useLocale(): Locale {
  const ctx = useContext(I18nContext)
  return ctx?.locale ?? DEFAULT_LOCALE
}
