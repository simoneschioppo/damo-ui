import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Code } from '../../_components/Code'
import { BRAND } from '../../../../lib/brand'
import { monoTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const RAW_SNIPPET = `:root {
  --plum-500: #4a2a4f;
  --gold-500: #d6a64f;
  --paper-100: #f8f3e6;
  /* …private scales, never used directly in product code */
}`

const SEMANTIC_SNIPPET = `:root {
  --background: var(--paper-100);
  --foreground: var(--plum-900);
  --primary: var(--gold-500);
  --primary-foreground: var(--plum-900);
  /* …public bg+fg pairs */
}`

const IDENTITY_SNIPPET = `:root {
  --nav-on-dark-bg: var(--plum-900);
  --badge-success: var(--success);
  --chart-1: var(--primary);
  /* …component-specific overrides */
}`

const SEMANTIC_TAILWIND = `// In JSX: use the lib's Tailwind utilities
<div className="bg-card text-card-foreground border-2 border-memphis p-4">
  <h3 className="text-foreground font-display text-xl">Title</h3>
  <p className="text-muted-foreground">Body copy goes here.</p>
  <button className="bg-primary text-primary-foreground px-3 py-1.5">
    Save
  </button>
</div>
`

const SEMANTIC_CSS = `/* In a stylesheet: read the variable directly */
.callout {
  background: var(--card);
  color: var(--card-foreground);
  border: 2px solid var(--memphis-border-color);
  box-shadow: var(--shadow-memphis);
  padding: 1rem;
  border-radius: var(--radius-md);
}
`

const SEMANTIC_INLINE = `// In JSX inline style: same vars, no Tailwind dependency
<div
  style={{
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
    padding: '0.75rem 1.25rem',
    boxShadow: 'var(--shadow-memphis)',
  }}
>
  Inline-styled chip
</div>
`

const OVERRIDE_ROOT = `/* Override at the root — affects the whole document */
:root {
  --primary: hsl(280 70% 55%);
  --primary-foreground: #ffffff;
  --radius-md: 12px;
  --shadow-memphis: 4px 4px 0 #000;
}
`

const OVERRIDE_SCOPED = `/* Override scoped to a subtree */
.brand-island {
  --primary: hsl(150 60% 45%);
  --memphis-shadow-color: hsl(150 60% 25%);
}

/* Now any <Button variant="primary" /> inside .brand-island
   uses the green primary, while the rest of the page is unchanged. */
`

const NEW_IDENTITY_TOKEN = `/* 1. Declare a new identity token at :root */
:root {
  --pricing-card-accent: var(--gold-500);
  --pricing-card-accent-foreground: var(--plum-900);
}

/* 2. Override per theme/palette as needed */
:root[data-theme='dark'] {
  --pricing-card-accent: var(--gold-300);
  --pricing-card-accent-foreground: #0a0a0a;
}

/* 3. Consume it in the component */
.pricing-card {
  background: var(--pricing-card-accent);
  color: var(--pricing-card-accent-foreground);
}
`

const DENSITY_USAGE = `/* Tailwind v4 multiplies every spacing utility by the lib's --spacing
   token, which itself is calc(0.25rem * var(--density-scale-y)). Use any
   spacing utility (p-4, gap-3, mt-2, …) and density flips component
   spacing without re-rendering React. */
.my-card {
  padding-block: calc(1rem * var(--density-scale-y));
  padding-inline: 1rem;
}

/* compact   → padding-block = 16px * 0.75 = 12px
   normal    → padding-block = 16px * 1.00 = 16px
   comfortable → padding-block = 16px * 1.25 = 20px */
`

export const metadata = { title: `Tokens — ${BRAND.libName}` }

export default async function TokensFoundationPage() {
  const tFoundations = await getTranslations('foundations')
  const t = await getTranslations('foundations.tokens')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tFoundations('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">{t('h1')}</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">{t('lead')}</p>

      <h2 className="font-display text-2xl mb-3">{t('section1.title')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('section1.body', { mono: monoTag, em: emTag })}
      </p>
      <Code code={RAW_SNIPPET} lang="css" title="raw" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('section2.title')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('section2.body', { mono: monoTag })}
      </p>
      <Code code={SEMANTIC_SNIPPET} lang="css" title="semantic" />

      <h3 className="font-display text-lg mb-3 mt-8">{t('section2.consumingTitle')}</h3>
      <p className="text-foreground/80 mb-3">{t('section2.consumingBody')}</p>
      <Code code={SEMANTIC_TAILWIND} lang="tsx" title="JSX · Tailwind utilities (recommended)" />
      <Code code={SEMANTIC_CSS} lang="css" title="CSS · var() reference" />
      <Code code={SEMANTIC_INLINE} lang="tsx" title="JSX · inline style" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('section3.title')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('section3.body', { mono: monoTag })}
      </p>
      <Code code={IDENTITY_SNIPPET} lang="css" title="identity" />

      <h3 className="font-display text-lg mb-3 mt-8">{t('section3.addingCustomTitle')}</h3>
      <Code code={NEW_IDENTITY_TOKEN} lang="css" title="define + theme + consume" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('overrideTitle')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('overrideBody', { mono: monoTag })}
      </p>
      <Code code={OVERRIDE_ROOT} lang="css" title="root override" />
      <Code code={OVERRIDE_SCOPED} lang="css" title="scoped override" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('densityTitle')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('densityBody', { mono: monoTag })}
      </p>
      <Code code={DENSITY_USAGE} lang="css" title="density-scale-y in product CSS" />

      <h2 className="font-display text-2xl mb-3 mt-10">{t('switchingTitle')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('switchingBody', {
          mono: monoTag,
          link: linkTag('/docs/foundations/theming'),
        })}
      </p>

      <p className="text-foreground/80 mt-6">
        {t.rich('generatorHint', { link: linkTag('/theme-generator') })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/getting-started" className="text-primary underline">
          {t('prevLink')}
        </Link>
        <Link href="/docs/foundations/theming" className="text-primary underline">
          {t('nextLink')}
        </Link>
      </div>
    </article>
  )
}
