import Link from 'next/link'
import { BRAND } from '../lib/brand'

export interface BrandMarkProps {
  /** When true, hides the wordmark and renders the mascot only. */
  readonly compact?: boolean
}

const NAVBAR_HEIGHT_PX = 28

const linkClass =
  'inline-flex items-center gap-2 no-underline text-foreground hover:opacity-80 transition-opacity'

const wordmarkClass = 'font-display text-base tracking-[0.18em] uppercase'

const mascotWidth = Math.round(NAVBAR_HEIGHT_PX * (BRAND.mascotWidth / BRAND.mascotHeight))

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link href="/" aria-label={`${BRAND.name} home`} className={linkClass}>
      <img
        src={BRAND.mascotSrc}
        alt=""
        width={mascotWidth}
        height={NAVBAR_HEIGHT_PX}
        decoding="async"
        loading="eager"
      />
      {!compact && <span className={wordmarkClass}>{BRAND.name}</span>}
    </Link>
  )
}
