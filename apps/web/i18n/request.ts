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
    // In production: silent fallback so missing IT keys don't blow up live.
    // In dev: log so we notice catalog regressions while iterating.
    onError:
      process.env.NODE_ENV === 'production'
        ? () => undefined
        : (err) => console.warn('[i18n]', err.code, err.message),
    getMessageFallback: ({ key, namespace }) => `${namespace ?? ''}.${key}`,
  }
})
