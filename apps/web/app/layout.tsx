import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { AppTopBar, type Locale } from 'damo-ui'
import { BrandMark } from '../components/BrandMark'
import { BRAND } from '../lib/brand'
import { DocsProviders } from './_components/DocsProviders'
import { DocsPreferencesMenu } from './_components/DocsPreferencesMenu'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND.libName} — Memphis-inspired component library`,
  description: BRAND.tagline,
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

// Next 15 split themeColor out of `metadata` into the `viewport` export so
// the address-bar tint can change per-route. We keep it static (brand purple)
// so Android Chrome / Safari iOS render the docs site with the brand color
// in the chrome strip instead of the OS default.
export const viewport: Viewport = {
  themeColor: '#7a3980',
}

// FOUC prevention. The server renders <html data-theme="light" data-palette="default"
// data-density="normal"> (the only safe defaults; localStorage is unreachable on
// the server). Without this script, a user who persisted dark mode would see a
// light flash on every cold reload — most painfully on the locale switch which
// triggers a full page reload to refresh RSC chrome. The script reads localStorage
// synchronously before <body> parses, validates against the same allow-lists used
// by DocsPreferencesMenu, and writes the matching data-attributes on
// document.documentElement so the very first paint has the user's preferences
// applied. The lib's `usePersistedAttr` lazy-inits its useState from localStorage
// for the same reason — together they ensure React's post-paint effects don't
// undo what the script set.
const PREFERENCES_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);var p=localStorage.getItem('palette');if(p==='default'||p==='sunset'||p==='cyberpunk'||p==='forest')d.setAttribute('data-palette',p);var n=localStorage.getItem('density');if(n==='compact'||n==='normal'||n==='comfortable')d.setAttribute('data-density',n)}catch(e){}})();`

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
        {/*
          MUST be the first script in <head> and MUST be synchronous (no
          defer/async). The string body is a hard-coded literal — there is no
          interpolation of user input — so dangerouslySetInnerHTML is safe here.
        */}
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_INIT_SCRIPT }} />
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
