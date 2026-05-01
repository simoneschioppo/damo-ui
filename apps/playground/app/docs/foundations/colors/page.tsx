import Link from 'next/link'
import { ColorScale, TokenSwatch } from '@damo/ui'

const PLUM_STOPS = [{ k: 900 }, { k: 800 }, { k: 700 }, { k: 500 }, { k: 300 }, { k: 100 }] as const
const GOLD_STOPS = [{ k: 500 }, { k: 400 }, { k: 300 }, { k: 200 }, { k: 100 }] as const
const PAPER_STOPS = [{ k: 300 }, { k: 200 }, { k: 100 }, { k: 50 }] as const

const SEMANTIC = [
  { name: 'Background', cssVar: '--background', usage: 'Sfondo principale dell\'app' },
  { name: 'Card', cssVar: '--card', usage: 'Card, modali, superfici elevate' },
  { name: 'Muted', cssVar: '--muted', usage: 'Superficie secondaria, hover' },
  { name: 'Foreground', cssVar: '--foreground', usage: 'Testo primario, bordi' },
  { name: 'Muted Foreground', cssVar: '--muted-foreground', usage: 'Testo secondario, hint' },
  { name: 'Primary', cssVar: '--primary', usage: 'Brand highlight (gold)' },
  { name: 'Secondary', cssVar: '--secondary', usage: 'Brand secondario (plum)' },
  { name: 'Memphis Border', cssVar: '--memphis-border-color', usage: 'Bordo Memphis 2px' },
] as const

export default function ColorsFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Colors</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Three brand scales (Plum, Gold, Paper) and eight semantic tokens. Switch the palette in
        the navbar to see every swatch on this page update live.
      </p>

      <h2 className="font-display text-2xl mb-3">Brand scales</h2>
      <div className="border-2 border-memphis bg-card shadow-memphis p-4 mb-8">
        <ColorScale
          name="Ink"
          token="ink"
          desc="Primario scuro — foreground, testo, sfondi notturni"
          stops={PLUM_STOPS}
        />
        <ColorScale
          name="Brand"
          token="brand"
          desc="Accent brand — bottoni, bordi, highlight"
          stops={GOLD_STOPS}
        />
        <ColorScale
          name="Paper"
          token="paper"
          desc="Sfondi caldi ivory/cream — base del prodotto"
          stops={PAPER_STOPS}
        />
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">Semantic tokens</h2>
      <p className="text-foreground/80 mb-4">
        Use these in product code. They re-point automatically when the palette changes.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SEMANTIC.map((s) => (
          <TokenSwatch key={s.cssVar} name={s.name} cssVar={s.cssVar} usage={s.usage} />
        ))}
      </div>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/tokens" className="text-primary underline">
          ← Tokens
        </Link>
        <Link href="/docs/foundations/typography" className="text-primary underline">
          Typography →
        </Link>
      </div>
    </article>
  )
}
