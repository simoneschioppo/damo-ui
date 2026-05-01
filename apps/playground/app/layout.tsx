import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { AppTopBar, ThemeSwitcher, PaletteSwitcher, DensitySwitcher } from '@damo/ui'
import { BrandMark } from '../components/BrandMark'
import { BRAND } from '../lib/brand'
import './globals.css'

export const metadata: Metadata = {
  title: `${BRAND.libName} — Memphis-inspired component library`,
  description: BRAND.tagline,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-density="normal" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AppTopBar
          logo={<BrandMark />}
          nav={
            <>
              <Link href="/docs">Docs</Link>
              <Link href="/theme-generator">Theme Generator</Link>
            </>
          }
          actions={
            <>
              <ThemeSwitcher />
              <PaletteSwitcher
                defaultValue="default"
                options={[
                  { value: 'default', label: 'Plum+Gold' },
                  { value: 'neon', label: 'Neon' },
                  { value: 'sunset', label: 'Sunset' },
                ]}
              />
              <DensitySwitcher />
            </>
          }
        />
        {children}
      </body>
    </html>
  )
}
