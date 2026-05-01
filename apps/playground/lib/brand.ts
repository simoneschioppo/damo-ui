/**
 * Single source of truth for site brand strings.
 *
 * The library this site documents is `@damo/ui`. The showcase used to be
 * branded separately as "Axolab"; that secondary identity has been retired
 * — the mascot now stands in for the brand visually and the library name
 * carries it textually wherever a label is required.
 */

export interface BrandConfig {
  readonly libName: string
  readonly tagline: string
  readonly mascotSrc: string
  readonly mascotAlt: string
  readonly mascotWidth: number
  readonly mascotHeight: number
  readonly repoUrl: string
}

export const BRAND: BrandConfig = {
  libName: 'Damo UI',
  tagline: 'Memphis-inspired React components, tokens, and patterns.',
  mascotSrc: '/mascot.png',
  mascotAlt: 'Damo UI mascot — a purple axolotl wearing glasses',
  mascotWidth: 720,
  mascotHeight: 470,
  repoUrl: 'https://github.com/simoneschioppo/damo-ui',
}
