import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { MemphisShape } from '@axologic/ui'
import { PatternSwatch } from '../../../_components/showcase'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PATTERNS } from '../../_lib/patterns'
import { BRAND } from '../../../../lib/brand'
import { monoTag, linkTag } from '../../../../lib/i18n-tags'

const RAW_CSS_PATTERN = `/* Apply the same pattern directly via CSS — no component required */
.hero {
  background: repeating-linear-gradient(
    45deg,
    var(--primary) 0 6px,
    transparent 6px 14px
  );
  background-color: var(--background);
}

.dotted-section {
  background-image: radial-gradient(var(--foreground) 2px, transparent 2px);
  background-size: 14px 14px;
}

.grid-bg {
  background-image:
    linear-gradient(var(--foreground) 1.5px, transparent 1.5px),
    linear-gradient(90deg, var(--foreground) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
}
`

const SHAPE_BASIC = `import { MemphisShape } from '@/components/ui/memphis-shape'

<MemphisShape variant="diamond" size={64} color="var(--primary)" />
<MemphisShape variant="circle"  size={64} color="var(--secondary)" />
<MemphisShape variant="star"    size={48} color="var(--success)" />
<MemphisShape variant="zigzag"  size={64} color="var(--foreground)" />
`

const SHAPE_AS_DECORATION = `// Float a shape behind a section title for the Memphis "stamp" feel
<section className="relative py-16">
  <MemphisShape
    variant="blob"
    size={180}
    color="var(--primary)"
    className="absolute -top-6 -left-8 -z-10 opacity-90"
  />
  <h2 className="font-display text-4xl">
    Pricing
  </h2>
</section>
`

const ONE_PATTERN_RULE = `// ❌ Combining patterns turns into noise
<div style={{ background: 'repeating-linear-gradient(...)' }}>
  <div style={{ background: 'radial-gradient(...)' }}>
    Stacked patterns fight for attention.
  </div>
</div>

// ✅ One pattern per surface, paired with solid Memphis chrome
<div className="bg-card border-2 border-memphis shadow-memphis p-6">
  <div
    className="aspect-video"
    style={{
      background: 'repeating-linear-gradient(45deg, var(--primary) 0 6px, transparent 6px 14px)',
    }}
  />
</div>
`

export const metadata = { title: `Patterns — ${BRAND.libName}` }

export default async function PatternsFoundationPage() {
  const tFoundations = await getTranslations('foundations')
  const t = await getTranslations('foundations.patterns')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tFoundations('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">{t('h1')}</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">{t('lead')}</p>

      <h2 className="font-display text-2xl mb-3">{t('tilesTitle')}</h2>
      <p className="text-foreground/80 mb-4">{t.rich('tilesBody', { mono: monoTag })}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
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

      <h3 className="font-display text-lg mb-3 mt-8">{t('tilesCssTitle')}</h3>
      <p className="text-foreground/80 mb-3">{t.rich('tilesCssBody', { mono: monoTag })}</p>
      <Code code={RAW_CSS_PATTERN} lang="css" title="raw CSS application" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('shapesTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('shapesBody', { mono: monoTag })}</p>

      <Example code={SHAPE_BASIC} previewClassName="px-6 py-10 flex gap-4 flex-wrap items-center">
        <MemphisShape variant="diamond" size={64} color="var(--primary)" />
        <MemphisShape variant="circle" size={64} color="var(--secondary)" />
        <MemphisShape variant="triangle" size={64} color="var(--foreground)" />
        <MemphisShape variant="blob" size={64} color="var(--success)" />
        <MemphisShape variant="wave" size={64} color="var(--foreground)" />
        <MemphisShape variant="star" size={64} color="var(--primary)" />
        <MemphisShape variant="zigzag" size={64} color="var(--foreground)" />
        <MemphisShape variant="lbar" size={64} color="var(--secondary)" />
      </Example>

      <h3 className="font-display text-lg mb-3 mt-8">{t('propsTitle')}</h3>
      <div className="border-2 border-memphis bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                {t('propsHeaders.prop')}
              </th>
              <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                {t('propsHeaders.type')}
              </th>
              <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                {t('propsHeaders.default')}
              </th>
              <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                {t('propsHeaders.description')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-memphis/40">
              <td className="px-4 py-2 font-mono">variant</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">MemphisShapeVariant</td>
              <td className="px-4 py-2 text-muted-foreground">—</td>
              <td className="px-4 py-2">{t('propsRows.variant')}</td>
            </tr>
            <tr className="border-t border-memphis/40">
              <td className="px-4 py-2 font-mono">size</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">number</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">64</td>
              <td className="px-4 py-2">{t('propsRows.size')}</td>
            </tr>
            <tr className="border-t border-memphis/40">
              <td className="px-4 py-2 font-mono">color</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">string</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">var(--secondary)</td>
              <td className="px-4 py-2">{t('propsRows.color')}</td>
            </tr>
            <tr className="border-t border-memphis/40">
              <td className="px-4 py-2 font-mono">className</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">string</td>
              <td className="px-4 py-2 text-muted-foreground">—</td>
              <td className="px-4 py-2">{t('propsRows.className')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="font-display text-lg mb-3 mt-8">{t('decorationTitle')}</h3>
      <p className="text-foreground/80 mb-3">{t.rich('decorationBody', { mono: monoTag })}</p>
      <Code code={SHAPE_AS_DECORATION} lang="tsx" title="JSX · decorative blob" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('oneAtATimeTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('oneAtATimeBody')}</p>
      <Code code={ONE_PATTERN_RULE} lang="tsx" title="do · don't" />

      <p className="text-foreground/80 mt-8">
        {t.rich('themingHint', { link: linkTag('/docs/foundations/theming') })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/typography" className="text-primary underline">
          {t('prevLink')}
        </Link>
        <Link href="/docs/components/box" className="text-primary underline">
          {t('nextLink')}
        </Link>
      </div>
    </article>
  )
}
