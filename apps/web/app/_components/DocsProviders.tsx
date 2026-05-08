'use client'

import { type ReactNode } from 'react'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { I18nProvider, type Locale } from '@damo/ui'

interface DocsProvidersProps {
  readonly locale: Locale
  readonly messages: AbstractIntlMessages
  readonly children: ReactNode
}

/**
 * Colocates the docs-site translation runtime (next-intl) with the lib's
 * `<I18nProvider>` so the chrome and the components render under the same
 * locale. Mounting the lib provider here means every page in the docs site
 * — server-rendered or client — resolves component defaults via the active
 * locale rather than the EN fallback.
 */
export function DocsProviders({ locale, messages, children }: DocsProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </NextIntlClientProvider>
  )
}
