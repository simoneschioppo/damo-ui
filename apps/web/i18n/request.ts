import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type AppLocale,
} from './locales'

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, type AppLocale }

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const candidate = cookieStore.get(LOCALE_COOKIE)?.value
  const locale: AppLocale = isSupportedLocale(candidate) ? candidate : DEFAULT_LOCALE

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    // Silences `ENVIRONMENT_FALLBACK` in dev/prod and prevents SSR markup
    // mismatches caused by server↔client time-zone differences. UTC is fine
    // for the docs site (no time-of-day formatting outside the playground).
    timeZone: 'UTC',
    // In production: silent fallback so missing IT keys don't blow up live.
    // In dev: log so we notice catalog regressions while iterating.
    // (Filters out ENVIRONMENT_FALLBACK to avoid the harmless time-zone
    // notice now that we set it explicitly above.)
    onError:
      process.env.NODE_ENV === 'production'
        ? () => undefined
        : (err) => {
            if (err.code === 'ENVIRONMENT_FALLBACK') return
            console.warn('[i18n]', err.code, err.message)
          },
    getMessageFallback: ({ key, namespace }) => `${namespace ?? ''}.${key}`,
  }
})
