import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ColorScale, TokenSwatch } from '../../../_components/showcase'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { BRAND } from '../../../../lib/brand'
import { monoTag, strongTag, linkTag } from '../../../../lib/i18n-tags'

const PLUM_STOPS = [{ k: 900 }, { k: 800 }, { k: 700 }, { k: 500 }, { k: 300 }, { k: 100 }] as const
const GOLD_STOPS = [{ k: 500 }, { k: 400 }, { k: 300 }, { k: 200 }, { k: 100 }] as const
const PAPER_STOPS = [{ k: 300 }, { k: 200 }, { k: 100 }, { k: 50 }] as const

const SEMANTIC_KEYS = [
  { name: 'Background', cssVar: '--background', usageKey: 'background' },
  { name: 'Card', cssVar: '--card', usageKey: 'card' },
  { name: 'Muted', cssVar: '--muted', usageKey: 'muted' },
  { name: 'Foreground', cssVar: '--foreground', usageKey: 'foreground' },
  { name: 'Muted Foreground', cssVar: '--muted-foreground', usageKey: 'mutedForeground' },
  { name: 'Primary', cssVar: '--primary', usageKey: 'primary' },
  { name: 'Secondary', cssVar: '--secondary', usageKey: 'secondary' },
  { name: 'Memphis Border', cssVar: '--memphis-border-color', usageKey: 'memphisBorder' },
] as const

const TAILWIND_BASIC = `<div className="bg-background text-foreground">
  <header className="bg-card text-card-foreground border-2 border-memphis p-4">
    <h1 className="text-foreground">Title</h1>
    <p className="text-muted-foreground">Subtitle</p>
  </header>
  <button className="bg-primary text-primary-foreground px-4 py-2">
    Primary action
  </button>
  <button className="bg-secondary text-secondary-foreground px-4 py-2">
    Secondary
  </button>
</div>
`

const TAILWIND_STATUS = `<div className="bg-success text-success-foreground px-3 py-1.5">
  Saved
</div>
<div className="bg-warning text-warning-foreground px-3 py-1.5">
  Heads up
</div>
<div className="bg-destructive text-destructive-foreground px-3 py-1.5">
  Action failed
</div>
<div className="bg-info text-info-foreground px-3 py-1.5">
  FYI
</div>
`

const CSS_VAR_USAGE = `/* Read the variable directly when you need a non-Tailwind property */
.timeline-dot {
  background: var(--primary);
  border: 2px solid var(--memphis-border-color);
  box-shadow: 0 0 0 4px var(--background);
}

.callout--danger {
  background: var(--destructive);
  color: var(--destructive-foreground);
}
`

const REACT_INLINE = `// JSX inline style — same vars, no Tailwind needed
<aside
  style={{
    background: 'var(--card)',
    color: 'var(--card-foreground)',
    border: '2px solid var(--memphis-border-color)',
    padding: '1rem',
  }}
>
  Static surface using the semantic layer
</aside>
`

const DARK_OVERRIDE = `/* app/globals.css — declare the dark variant once.
   Every utility (bg-card, text-foreground, …) and component
   re-points automatically when [data-theme='dark'] is set. */
:root[data-theme='dark'] {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #18181b;
  --card-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --primary: #fafafa;
  --primary-foreground: #18181b;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --border: #27272a;
  --memphis-shadow-color: #fafafa;
  --memphis-border-color: #fafafa;
}
`

const PALETTE_OVERRIDE = `/* Add a custom palette and switch via data-palette */
:root[data-palette='cyberpunk'] {
  --primary: #ffab00;
  --primary-foreground: #170731;
  --secondary: #7c4dff;
  --secondary-foreground: #ffffff;
}
`

const FOREGROUND_PAIR_TIP = `// Always pair bg- with the matching text- token
// ✅ contrast guaranteed by the lib
<div className="bg-primary text-primary-foreground" />
<div className="bg-card text-card-foreground" />

// ❌ contrast not guaranteed when a custom palette is active
<div className="bg-primary text-foreground" />
`

const SEMANTIC_REFERENCE = `// All semantic tokens shipped by Damo UI
const TOKENS = [
  '--background', '--foreground',
  '--card', '--card-foreground',
  '--popover', '--popover-foreground',
  '--muted', '--muted-foreground',
  '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground',
  '--destructive', '--destructive-foreground',
  '--success', '--success-foreground',
  '--warning', '--warning-foreground',
  '--info', '--info-foreground',
  '--border', '--border-strong',
  '--ring',
  '--memphis-border-color', '--memphis-shadow-color',
] as const
`

export const metadata = { title: `Colors — ${BRAND.libName}` }

export default async function ColorsFoundationPage() {
  const tFoundations = await getTranslations('foundations')
  const t = await getTranslations('foundations.colors')
  const tTokens = await getTranslations('foundations.colors.semanticTokens')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tFoundations('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">{t('h1')}</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">{t('lead')}</p>

      <h2 className="font-display text-2xl mb-3">{t('brandScalesTitle')}</h2>
      <div className="border-2 border-memphis bg-card shadow-memphis p-4 mb-8">
        <ColorScale
          name={t('scales.ink.name')}
          token="ink"
          desc={t('scales.ink.desc')}
          stops={PLUM_STOPS}
        />
        <ColorScale
          name={t('scales.brand.name')}
          token="brand"
          desc={t('scales.brand.desc')}
          stops={GOLD_STOPS}
        />
        <ColorScale
          name={t('scales.paper.name')}
          token="paper"
          desc={t('scales.paper.desc')}
          stops={PAPER_STOPS}
        />
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">{t('semanticTitle')}</h2>
      <p className="text-foreground/80 mb-4">{t('semanticBody')}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {SEMANTIC_KEYS.map((s) => (
          <TokenSwatch key={s.cssVar} name={s.name} cssVar={s.cssVar} usage={tTokens(s.usageKey)} />
        ))}
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">{t('jsxTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('jsxBody', { mono: monoTag })}</p>
      <Example code={TAILWIND_BASIC} previewClassName="px-6 py-10 flex flex-col items-center gap-3">
        <div className="bg-card text-card-foreground border-2 border-memphis p-4 w-full max-w-sm">
          <h3 className="text-foreground font-display text-xl mb-1">{t('examplesTitle')}</h3>
          <p className="text-muted-foreground">{t('examplesSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 border-2 border-memphis"
            type="button"
          >
            {t('examplesPrimary')}
          </button>
          <button
            className="bg-secondary text-secondary-foreground px-4 py-2 border-2 border-memphis"
            type="button"
          >
            {t('examplesSecondary')}
          </button>
        </div>
      </Example>

      <h3 className="font-display text-lg mb-3 mt-8">{t('statusTitle')}</h3>
      <Example
        code={TAILWIND_STATUS}
        previewClassName="px-6 py-8 flex flex-wrap gap-3 justify-center"
      >
        <div className="bg-success text-success-foreground px-3 py-1.5 border-2 border-memphis">
          {t('statusSaved')}
        </div>
        <div className="bg-warning text-warning-foreground px-3 py-1.5 border-2 border-memphis">
          {t('statusHeadsUp')}
        </div>
        <div className="bg-destructive text-destructive-foreground px-3 py-1.5 border-2 border-memphis">
          {t('statusFailed')}
        </div>
        <div className="bg-info text-info-foreground px-3 py-1.5 border-2 border-memphis">
          {t('statusInfo')}
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{t('cssTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('cssBody')}</p>
      <Code code={CSS_VAR_USAGE} lang="css" title="any stylesheet" />

      <h3 className="font-display text-lg mb-3 mt-8">{t('inlineTitle')}</h3>
      <Code code={REACT_INLINE} lang="tsx" title="JSX inline style" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('pairTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('pairBody')}</p>
      <Code code={FOREGROUND_PAIR_TIP} lang="tsx" title="contrast pairing" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('darkTitle')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('darkBody', { mono: monoTag, strong: strongTag })}
      </p>
      <Code code={DARK_OVERRIDE} lang="css" title="dark mode override" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('customPaletteTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('customPaletteBody', { mono: monoTag })}</p>
      <Code code={PALETTE_OVERRIDE} lang="css" title="palette override" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('fullListTitle')}</h2>
      <Code code={SEMANTIC_REFERENCE} lang="ts" title="reference" />

      <p className="text-foreground/80 mt-8">
        {t.rich('themingHint', { link: linkTag('/docs/foundations/theming') })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/theming" className="text-primary underline">
          {t('prevLink')}
        </Link>
        <Link href="/docs/foundations/typography" className="text-primary underline">
          {t('nextLink')}
        </Link>
      </div>
    </article>
  )
}
