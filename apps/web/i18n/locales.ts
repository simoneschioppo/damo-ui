/**
 * Shared locale constants — server-and-client safe (no `next/headers` import,
 * no React, no DOM). Both `i18n/request.ts` (server) and
 * `lib/usePersistedLocale.ts` (client) import from here so the cookie name
 * and the supported set stay in lockstep.
 */

export const SUPPORTED_LOCALES = ['en', 'it'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: AppLocale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return value === 'en' || value === 'it'
}
