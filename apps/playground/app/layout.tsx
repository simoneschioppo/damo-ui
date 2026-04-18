import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Damacchi UI — Playground',
  description: 'Showcase of the Damacchi UI component library',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="light"
      data-palette="plum-gold"
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
      <body>{children}</body>
    </html>
  )
}
