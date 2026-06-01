import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { TypeSpecimen } from '../../../_components/showcase'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { BRAND } from '../../../../lib/brand'
import { monoTag, strongTag, linkTag } from '../../../../lib/i18n-tags'

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

const FONTS_LOAD = `// app/layout.tsx — load Audiowide + Exo 2 from Google Fonts
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
`

const FONTS_TOKEN_OVERRIDE = `/* app/globals.css — bind your loaded families to the lib's variables */
:root {
  --font-display: 'Audiowide', system-ui, sans-serif;
  --font-body: 'Exo 2', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
}
`

const NEXT_LOCAL_FONTS = `// app/layout.tsx — Next.js 'next/font/google' alternative
import { Audiowide, Exo_2 } from 'next/font/google'

const display = Audiowide({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const body = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={\`\${display.variable} \${body.variable}\`}>
      <body>{children}</body>
    </html>
  )
}
`

const TAILWIND_FONTS = `// In JSX: use the lib's Tailwind utilities
<h1 className="font-display text-5xl leading-[0.95]">
  Damo UI
</h1>
<p className="font-body text-base text-foreground/80">
  Body copy uses the body family by default — explicit class for clarity.
</p>
<code className="font-mono text-sm">
  npx damo-ui add button
</code>
`

const HELPER_CLASSES = `// Three CSS helpers ship in ./styles/globals.css (copied via: npx damo-ui add base)
<h2 className="display">Display heading</h2>
<code className="mono">read-only mono span</code>
<span className="eyebrow">SECTION LABEL</span>
`

const CSS_FONT_USAGE = `/* In a stylesheet — read the variable */
.callout {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.code-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
}
`

const EYEBROW_PATTERN = `// The "eyebrow" pattern: small uppercase mono accent above a heading.
// Helps with hierarchy and ties into the Memphis vibe.
<section>
  <span className="eyebrow">FOUNDATIONS</span>
  <h2 className="font-display text-4xl">Typography</h2>
  <p className="text-muted-foreground">
    Sub-copy explaining the section.
  </p>
</section>
`

export const metadata = { title: `Typography — ${BRAND.libName}` }

export default async function TypographyFoundationPage() {
  const tFoundations = await getTranslations('foundations')
  const t = await getTranslations('foundations.typography')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tFoundations('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">{t('h1')}</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">{t('lead')}</p>

      <h2 className="font-display text-2xl mb-3">{t('specimensTitle')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <TypeSpecimen
          name={t('displaySpecimenName')}
          sample={t('displaySpecimenSample')}
          fontFamily="var(--font-display)"
          sampleSize={64}
        />
        <TypeSpecimen
          name={t('bodySpecimenName')}
          sample={t('bodySpecimenSample')}
          fontFamily="var(--font-body)"
          sampleSize={36}
        />
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">{t('scaleTitle')}</h2>
      <div className="border-2 border-memphis bg-card shadow-memphis mb-12">
        {TYPE_SCALE.map((row, idx) => (
          <div
            key={row.name}
            className={`grid grid-cols-[140px_1fr_140px] gap-6 items-baseline px-4 py-4 ${
              idx === 0 ? '' : 'border-t border-memphis/40'
            }`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {row.name}
            </div>
            <div
              style={{
                fontFamily: fontVar(row.font),
                fontSize: row.size,
                fontWeight: row.weight,
                lineHeight: 1.1,
                textTransform: row.upper === true ? 'uppercase' : 'none',
                letterSpacing: row.track !== undefined ? `${row.track}em` : '0',
                color: 'var(--foreground)',
              }}
            >
              {row.upper === true ? t('scaleSampleUpper') : t('scaleSampleNormal')}
            </div>
            <div className="font-mono text-[11px] text-primary text-right">
              {row.size}px / {row.weight}
              <br />
              <span className="text-muted-foreground">--font-{row.font}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">{t('loadingTitle')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('loadingBody', { mono: monoTag, strong: strongTag })}
      </p>
      <Code code={FONTS_LOAD} lang="tsx" title="option A · Google Fonts <link>" />
      <Code code={FONTS_TOKEN_OVERRIDE} lang="css" title="option A · bind to tokens" />
      <p className="text-foreground/80 mt-6 mb-3">{t.rich('loadingNextHint', { mono: monoTag })}</p>
      <Code code={NEXT_LOCAL_FONTS} lang="tsx" title="option B · next/font/google" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('tailwindTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('tailwindBody', { mono: monoTag })}</p>
      <Example code={TAILWIND_FONTS} previewClassName="px-6 py-8 flex flex-col gap-3 items-start">
        <h3 className="font-display text-4xl leading-[0.95]">Damo UI</h3>
        <p className="font-body text-base text-foreground/80">{t('tailwindPreviewBody')}</p>
        <code className="font-mono text-sm bg-muted px-2 py-1 border border-memphis/40">
          npx damo-ui add button
        </code>
      </Example>

      <h3 className="font-display text-lg mb-3 mt-8">{t('helperTitle')}</h3>
      <p className="text-foreground/80 mb-3">{t.rich('helperBody', { mono: monoTag })}</p>
      <Example code={HELPER_CLASSES} previewClassName="px-6 py-8 flex flex-col gap-3 items-start">
        <h2 className="display text-4xl">{t('helperPreviewDisplay')}</h2>
        <code className="mono text-sm">{t('helperPreviewMono')}</code>
        <span className="eyebrow">{t('helperPreviewEyebrow')}</span>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{t('cssTitle')}</h2>
      <Code code={CSS_FONT_USAGE} lang="css" title="any stylesheet" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('eyebrowPatternTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('eyebrowPatternBody')}</p>
      <Example code={EYEBROW_PATTERN} previewClassName="px-6 py-8 flex flex-col items-start gap-1">
        <span className="eyebrow">{tFoundations('eyebrow')}</span>
        <h3 className="font-display text-4xl leading-[0.95]">{t('h1')}</h3>
        <p className="text-muted-foreground">{t('eyebrowPreviewSubcopy')}</p>
      </Example>

      <p className="text-foreground/80 mt-8">
        {t.rich('swapHint', { mono: monoTag, link: linkTag('/docs/foundations/tokens') })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/colors" className="text-primary underline">
          {t('prevLink')}
        </Link>
        <Link href="/docs/foundations/patterns" className="text-primary underline">
          {t('nextLink')}
        </Link>
      </div>
    </article>
  )
}
