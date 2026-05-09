import { describe, expect, it } from 'vitest'
import { metadata, viewport } from '../layout'

describe('app/layout metadata (#78)', () => {
  it('exposes Next.js metadata.icons with icon, shortcut, apple entries', () => {
    expect(metadata.icons).toBeDefined()
    const icons = metadata.icons as {
      icon?: Array<{ url: string; sizes?: string; type?: string }>
      shortcut?: unknown
      apple?: Array<{ url: string; sizes?: string }>
    }
    expect(Array.isArray(icons.icon)).toBe(true)
    expect(icons.icon?.some((i) => i.url === '/favicon-16x16.png' && i.sizes === '16x16')).toBe(
      true,
    )
    expect(icons.icon?.some((i) => i.url === '/favicon-32x32.png' && i.sizes === '32x32')).toBe(
      true,
    )
    expect(JSON.stringify(icons.shortcut)).toContain('/favicon.ico')
    expect(
      icons.apple?.some((i) => i.url === '/apple-touch-icon.png' && i.sizes === '180x180'),
    ).toBe(true)
  })

  it('points metadata.manifest at /site.webmanifest', () => {
    expect(metadata.manifest).toBe('/site.webmanifest')
  })

  it('declares a metadataBase URL so manifest+icon links resolve absolutely', () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL)
  })
})

describe('app/layout viewport (#78)', () => {
  it('sets the brand-purple theme color so Android Chrome / iOS Safari tint the chrome strip', () => {
    expect(viewport.themeColor).toBe('#7a3980')
  })
})
