'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Locale } from 'damo-ui'
import { LOCALE_COOKIE, SUPPORTED_LOCALES } from '../i18n/locales'

const STORAGE_KEY = 'locale'
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365

function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'it'
}

function readLocaleFromDom(initial: Locale): Locale {
  if (typeof document === 'undefined') return initial
  const dataAttr = document.documentElement.getAttribute('data-locale')
  if (isLocale(dataAttr)) return dataAttr
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage unavailable (Safari private mode, blocked cookies, etc.) —
    // fall through to the server-resolved initial value.
  }
  return initial
}

/**
 * Locale persistence — counterpart to lib `usePersistedAttr` but writes the
 * extra surfaces locale needs:
 *   - `localStorage.locale` (client-side preference store)
 *   - `<html data-locale>` (matches the existing data-attribute convention)
 *   - `<html lang>` (semantic, drives a11y + hyphenation; required by AC7)
 *   - `NEXT_LOCALE` cookie (server-side resolver in i18n/request.ts)
 *
 * `initial` is the server-resolved locale, used to seed state until
 * hydration so we don't blow away the server render.
 */
export function usePersistedLocale(initial: Locale): readonly [Locale, (next: Locale) => void] {
  const [locale, setLocaleState] = useState<Locale>(initial)

  // Sync from localStorage on mount (handles the case where the cookie and
  // localStorage diverged — localStorage wins on the client; the next request
  // will see the cookie write).
  useEffect(() => {
    const fromDom = readLocaleFromDom(initial)
    if (fromDom !== locale) setLocaleState(fromDom)
    // Ensure DOM reflects the chosen locale on first paint.
    document.documentElement.setAttribute('data-locale', fromDom)
    document.documentElement.setAttribute('lang', fromDom)
    // Intentionally fire-and-forget — only run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLocale = useCallback((next: Locale) => {
    if (!SUPPORTED_LOCALES.includes(next)) return
    setLocaleState(next)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-locale', next)
      document.documentElement.setAttribute('lang', next)
    }
    if (typeof window !== 'undefined') {
      // localStorage write can throw in Safari private mode / when storage is
      // full / when cookies are blocked. The cookie write below is independent
      // and the locale state already updated in React, so we tolerate failure
      // here — the user just loses cross-reload preference until they switch
      // again on a session that allows storage.
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Intentionally swallowed — see comment above.
      }
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${COOKIE_MAX_AGE_SEC}; samesite=lax; secure`
    }
  }, [])

  return [locale, setLocale] as const
}
