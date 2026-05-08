import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export const SUPPORTED_LOCALES = ['en', 'it'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: AppLocale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

function isSupported(value: string | undefined): value is AppLocale {
  return value === 'en' || value === 'it'
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const candidate = cookieStore.get(LOCALE_COOKIE)?.value
  const locale: AppLocale = isSupported(candidate) ? candidate : DEFAULT_LOCALE

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    // Missing IT keys fall back silently to EN — keeps the IT catalog free
    // to grow asymmetrically without runtime errors.
    onError: () => undefined,
    getMessageFallback: ({ key, namespace }) => `${namespace ?? ''}.${key}`,
  }
})
