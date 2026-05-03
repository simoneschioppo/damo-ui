import Link from 'next/link'
import { MemphisShape } from '@damo/ui'
import { BRAND } from '../lib/brand'

const ctaPrimaryClass =
  'inline-flex items-center justify-center px-6 py-3 font-semibold uppercase tracking-wide bg-primary text-primary-foreground border-2 border-memphis shadow-memphis-lg no-underline hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform'

const ctaGhostClass =
  'inline-flex items-center justify-center px-6 py-3 font-semibold uppercase tracking-wide bg-card text-foreground border-2 border-memphis shadow-memphis no-underline hover:bg-muted transition-colors'

const features = [
  {
    title: '47 components',
    desc: 'Buttons, cards, dialogs, inputs, and 40+ more, all on a Memphis-styled chrome.',
  },
  {
    title: '3-layer tokens',
    desc: 'Raw scales feed semantic pairs that feed identity overrides — switchable live.',
  },
  {
    title: 'Theme Generator',
    desc: 'Visual editor with per-mode palette and CSS / Tailwind / JSON exports.',
  },
] as const

export default function HomePage() {
  return (
    <main className="px-6 sm:px-10 lg:px-16 py-16 max-w-[1200px] mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 items-center mb-20">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-4">
            DOCUMENTATION
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
            {BRAND.libName} —
            <br />
            tokens, components,
            <br />
            patterns Memphis.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[60ch] mb-8">
            {BRAND.tagline} Compose React + Next.js UIs without giving up the visual identity.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs" className={ctaPrimaryClass}>
              Browse docs
            </Link>
            <Link href="/theme-generator" className={ctaGhostClass}>
              Open theme generator
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                'repeating-linear-gradient(45deg, var(--primary) 0 6px, transparent 6px 14px)',
              opacity: 0.18,
              clipPath: 'polygon(0 18%, 100% 0, 96% 88%, 4% 100%)',
            }}
          />
          <img
            src={BRAND.mascotHeroSrc}
            alt={BRAND.mascotHeroAlt}
            width={320}
            height={Math.round(320 * (BRAND.mascotHeroHeight / BRAND.mascotHeroWidth))}
            className="relative drop-shadow-[6px_6px_0_var(--memphis-shadow-color)]"
            style={{ transform: 'rotate(-4deg)' }}
          />
          <MemphisShape
            variant="diamond"
            size={72}
            color="var(--secondary)"
            className="absolute -top-4 -left-4"
          />
          <MemphisShape
            variant="star"
            size={52}
            color="var(--primary)"
            className="absolute -bottom-6 -right-6"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-2 border-memphis pt-10">
        {features.map((f) => (
          <div
            key={f.title}
            className="border-2 border-memphis bg-card shadow-memphis p-5 flex flex-col gap-2"
          >
            <div className="font-display text-xl tracking-wide">{f.title}</div>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 border-t-2 border-memphis pt-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
          QUICK INSTALL
        </div>
        <h2 className="font-display text-3xl mb-4">Three steps and you're rendering.</h2>
        <ol className="space-y-2 text-foreground/85 list-decimal pl-5">
          <li>
            Add{' '}
            <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">@damo</code>{' '}
            scope to your <code className="font-mono">.npmrc</code>.
          </li>
          <li>
            <code className="font-mono">pnpm add @damo/ui</code>.
          </li>
          <li>
            <Link href="/docs/getting-started" className="text-primary underline">
              Wire styles and ship
            </Link>
            .
          </li>
        </ol>
      </section>
    </main>
  )
}
