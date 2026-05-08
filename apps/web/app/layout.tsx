import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { AppTopBar, type Locale } from '@damo/ui'
import { BrandMark } from '../components/BrandMark'
import { BRAND } from '../lib/brand'
import { DocsProviders } from './_components/DocsProviders'
import { DocsPreferencesMenu } from './_components/DocsPreferencesMenu'
import './globals.css'

export const metadata: Metadata = {
  title: `${BRAND.libName} — Memphis-inspired component library`,
  description: BRAND.tagline,
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await getLocale()) as Locale
  const messages = await getMessages()
  const t = await getTranslations('nav')

  return (
    <html
      lang={locale}
      data-locale={locale}
      data-theme="light"
      data-palette="default"
      data-density="normal"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <DocsProviders locale={locale} messages={messages}>
          <AppTopBar
            logo={<BrandMark />}
            nav={
              <>
                <Link href="/docs">{t('docs')}</Link>
                <Link href="/theme-generator">{t('themeGenerator')}</Link>
              </>
            }
            actions={<DocsPreferencesMenu />}
          />
          {children}
        </DocsProviders>
      </body>
    </html>
  )
}
