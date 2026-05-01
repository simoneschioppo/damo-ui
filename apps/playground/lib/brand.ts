/**
 * Single source of truth for the *site* identity.
 *
 * The site (this Next.js app) is the showcase. The library it documents
 * is `@damo/ui` and is referred to throughout the docs by `BRAND.libName`.
 * Keeping the two names separated here means the showcase can be renamed
 * without touching the library.
 */

export interface BrandConfig {
  readonly name: string
  readonly libName: string
  readonly tagline: string
  readonly mascotSrc: string
  readonly mascotAlt: string
  readonly mascotWidth: number
  readonly mascotHeight: number
  readonly repoUrl: string
}

export const BRAND: BrandConfig = {
  name: 'Axolab',
  libName: 'Damo UI',
  tagline: 'Memphis-inspired React components, tokens, and patterns.',
  mascotSrc: '/mascot.png',
  mascotAlt: 'Axolab mascot — a blue axolotl wearing glasses',
  mascotWidth: 283,
  mascotHeight: 197,
  repoUrl: 'https://github.com/simoneschioppo/damo-ui',
}
