import Link from 'next/link'
import { TypeSpecimen } from '@damo/ui'
import { BRAND } from '../../../../lib/brand'

interface TypeRow {
  readonly name: string
  readonly size: number
  readonly weight: number
  readonly font: 'display' | 'body' | 'mono'
  readonly upper?: boolean
  readonly track?: number
}

const TYPE_SCALE: ReadonlyArray<TypeRow> = [
  { name: 'Display XL', size: 68, weight: 400, font: 'display' },
  { name: 'Display L', size: 48, weight: 400, font: 'display' },
  { name: 'Display M', size: 36, weight: 400, font: 'display' },
  { name: 'Display S', size: 24, weight: 400, font: 'display' },
  { name: 'Body XL', size: 20, weight: 500, font: 'body' },
  { name: 'Body L', size: 18, weight: 500, font: 'body' },
  { name: 'Body M', size: 16, weight: 400, font: 'body' },
  { name: 'Body S', size: 14, weight: 400, font: 'body' },
  { name: 'Caption', size: 12, weight: 500, font: 'body' },
  { name: 'Mono / Eyebrow', size: 11, weight: 700, font: 'mono', upper: true, track: 0.22 },
]

function fontVar(font: TypeRow['font']): string {
  if (font === 'display') return 'var(--font-display)'
  if (font === 'mono') return 'var(--font-mono)'
  return 'var(--font-body)'
}

export const metadata = { title: `Typography — ${BRAND.libName}` }

export default function TypographyFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Typography</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Audiowide for display, Exo 2 for body and UI. The personality lives in weight, tracking, and
        the eyebrow mono accent — no extra families needed.
      </p>

      <h2 className="font-display text-2xl mb-3">Specimens</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <TypeSpecimen
          name="DISPLAY · AUDIOWIDE · GOOGLE FONTS"
          sample="Damo UI"
          fontFamily="var(--font-display)"
          sampleSize={64}
        />
        <TypeSpecimen
          name="BODY · EXO 2 · GOOGLE FONTS"
          sample="Ogni token al suo posto."
          fontFamily="var(--font-body)"
          sampleSize={36}
        />
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">Scale</h2>
      <div className="border-2 border-memphis bg-card shadow-memphis">
        {TYPE_SCALE.map((t, idx) => (
          <div
            key={t.name}
            className={`grid grid-cols-[140px_1fr_140px] gap-6 items-baseline px-4 py-4 ${
              idx === 0 ? '' : 'border-t border-memphis/40'
            }`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t.name}
            </div>
            <div
              style={{
                fontFamily: fontVar(t.font),
                fontSize: t.size,
                fontWeight: t.weight,
                lineHeight: 1.1,
                textTransform: t.upper === true ? 'uppercase' : 'none',
                letterSpacing: t.track !== undefined ? `${t.track}em` : '0',
                color: 'var(--foreground)',
              }}
            >
              {t.upper === true ? 'DAMO · UI · DESIGN' : 'Damo UI · token e componenti'}
            </div>
            <div className="font-mono text-[11px] text-primary text-right">
              {t.size}px / {t.weight}
              <br />
              <span className="text-muted-foreground">--font-{t.font}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/colors" className="text-primary underline">
          ← Colors
        </Link>
        <Link href="/docs/foundations/patterns" className="text-primary underline">
          Patterns →
        </Link>
      </div>
    </article>
  )
}
