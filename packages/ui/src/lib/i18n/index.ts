export { I18nProvider, useI18n, useLocale, type I18nProviderProps } from './provider'
// Only `dictionaries` (the combined Record<Locale, Dictionary>) is the
// intended public surface. The raw per-locale objects (`en`, `it`) stay
// internal so future locale additions don't churn the public API.
export { dictionaries } from './dictionaries'
export { DEFAULT_LOCALE, type Dictionary, type Locale } from './types'
