import Link from 'next/link'
import { BRAND } from '../lib/brand'

const ctaPrimaryClass =
  'inline-flex items-center justify-center px-5 py-2.5 font-semibold uppercase tracking-wide bg-primary text-primary-foreground border-2 border-memphis shadow-memphis no-underline hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform'

const ctaGhostClass =
  'inline-flex items-center justify-center px-5 py-2.5 font-semibold uppercase tracking-wide bg-card text-foreground border-2 border-memphis shadow-memphis no-underline hover:bg-muted transition-colors'

export default function NotFound() {
  return (
    <main className="px-6 py-20 max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
      <img
        src={BRAND.mascotSrc}
        alt={BRAND.mascotAlt}
        width={220}
        height={Math.round(220 * (BRAND.mascotHeight / BRAND.mascotWidth))}
        className="drop-shadow-[6px_6px_0_var(--memphis-border-color)]"
      />
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
        ERROR · 404
      </div>
      <h1 className="font-display text-5xl leading-[0.95]">Page not found.</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch]">
        That link does not lead anywhere. Head back home, or jump straight into the documentation.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className={ctaPrimaryClass}>
          Back to home
        </Link>
        <Link href="/docs" className={ctaGhostClass}>
          Open documentation
        </Link>
      </div>
    </main>
  )
}
