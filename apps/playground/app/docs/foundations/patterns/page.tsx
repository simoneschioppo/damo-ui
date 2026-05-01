import Link from 'next/link'
import { PatternSwatch, MemphisShape } from '@damo/ui'
import { PATTERNS } from '../../_lib/patterns'
import { BRAND } from '../../../../lib/brand'

export const metadata = { title: `Patterns — ${BRAND.libName}` }

export default function PatternsFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Patterns</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Texture and shape primitives that fill empty space. Use one at a time — the Memphis look is
        loud enough that combining patterns turns into noise.
      </p>

      <h2 className="font-display text-2xl mb-3">Tileable backgrounds</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PATTERNS.map((p) => (
          <PatternSwatch
            key={p.name}
            name={p.name}
            background={p.background}
            backgroundSize={p.backgroundSize}
            backgroundColor={p.backgroundColor}
          >
            {p.children}
          </PatternSwatch>
        ))}
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">Shape primitives</h2>
      <div className="border-2 border-memphis bg-card shadow-memphis p-6 flex gap-4 flex-wrap items-center">
        <MemphisShape variant="diamond" size={64} color="var(--primary)" />
        <MemphisShape variant="circle" size={64} color="var(--secondary)" />
        <MemphisShape variant="triangle" size={64} color="var(--foreground)" />
        <MemphisShape variant="blob" size={64} color="var(--success)" />
        <MemphisShape variant="wave" size={64} color="#000" />
        <MemphisShape variant="star" size={64} color="var(--primary)" />
      </div>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/typography" className="text-primary underline">
          ← Typography
        </Link>
        <Link href="/docs/components/button" className="text-primary underline">
          Button →
        </Link>
      </div>
    </article>
  )
}
