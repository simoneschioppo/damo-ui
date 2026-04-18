import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Damacchi UI — Playground',
  description: 'Showcase of the Damacchi UI component library',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" data-theme="light" data-palette="plum-gold" data-density="normal">
      <body>{children}</body>
    </html>
  )
}
