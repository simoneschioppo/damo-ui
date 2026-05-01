import Link from 'next/link'
import { BRAND } from '../lib/brand'

// Tuned against AppTopBar's --header-height (56px): ~40px leaves a 4-px
// breathing margin top and bottom and reads as a brand mark rather than a
// floating icon.
const MASCOT_HEIGHT_PX = 40

const linkClass =
  'inline-flex items-center leading-none no-underline text-foreground hover:opacity-80 transition-opacity'

const mascotWidth = Math.round(MASCOT_HEIGHT_PX * (BRAND.mascotWidth / BRAND.mascotHeight))

export function BrandMark() {
  return (
    <Link href="/" aria-label={`${BRAND.libName} home`} className={linkClass}>
      <img
        src={BRAND.mascotSrc}
        alt=""
        width={mascotWidth}
        height={MASCOT_HEIGHT_PX}
        decoding="async"
        loading="eager"
        className="block"
      />
    </Link>
  )
}
