import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@axologic/ui'
import { Code } from '../_components/Code'
import { Example } from '../_components/Example'
import { BRAND } from '../../../lib/brand'
import { codeTag, monoTag, strongTag, linkTag } from '../../../lib/i18n-tags'

const INSTALL_SNIPPET = `pnpm add damo-ui
# or
npm install damo-ui
# or
yarn add damo-ui
`

const STYLES_SNIPPET = `// app/layout.tsx
import 'damo-ui/styles/tokens.css'
import 'damo-ui/styles/globals.css'
`

const TAILWIND_SNIPPET = `/* app/globals.css */
@import '@axologic/ui/styles/tokens.css';
@import '@axologic/ui/styles/globals.css';

@import 'tailwindcss';
@import '@axologic/ui/styles/theme.css';

@source '../../node_modules/damo-ui/dist/**/*.js';
`

const FIRST_BUTTON_SNIPPET = `import { Button } from '@axologic/ui'

export default function Page() {
  return <Button variant="primary">Save</Button>
}
`

const ROOT_LAYOUT_SNIPPET = `// app/layout.tsx
import { AppTopBar, AttrToggleGroup } from '@axologic/ui'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"        // 'light' | 'dark' | …your custom values
      data-palette="default"    // any value you wired in CSS
      data-density="normal"     // 'compact' | 'normal' | 'comfortable'
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppTopBar
          logo={<a href="/">Brand</a>}
          actions={
            <>
              <AttrToggleGroup
                label="Theme"
                storageKey="theme"
                attribute="data-theme"
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark',  label: 'Dark' },
                ]}
                defaultValue="light"
              />
              <AttrToggleGroup
                label="Palette"
                variant="select"
                storageKey="palette"
                attribute="data-palette"
                options={[
                  { value: 'default',   label: 'Default' },
                  { value: 'cyberpunk', label: 'Cyberpunk' },
                ]}
                defaultValue="default"
              />
              <AttrToggleGroup
                label="Density"
                storageKey="density"
                attribute="data-density"
                options={[
                  { value: 'compact',     label: 'Compact' },
                  { value: 'normal',      label: 'Normal' },
                  { value: 'comfortable', label: 'Comfortable' },
                ]}
                defaultValue="normal"
              />
            </>
          }
        />
        {children}
      </body>
    </html>
  )
}
`

export const metadata = {
  title: `Getting Started — ${BRAND.libName}`,
  description: `Install ${BRAND.libName} and ship your first component.`,
}

export default async function GettingStartedPage() {
  const t = await getTranslations('gettingStarted')

  return (
    <article className="prose-sized">
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {t('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">
        {t('headlineLine1')}
        <br />
        {t('headlineLine2')}
      </h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-12">{t('lead')}</p>

      <h2 className="font-display text-2xl mb-3">{t('step1.title')}</h2>
      <Code code={INSTALL_SNIPPET} lang="bash" title="terminal" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('step2.title')}</h2>
      <p className="text-foreground/80 mb-2">{t('step2.body')}</p>
      <Code code={STYLES_SNIPPET} lang="tsx" title="app/layout.tsx" />

      <p className="text-foreground/80 mt-6 mb-2">
        {t.rich('step2.tailwindHint', { mono: monoTag })}
      </p>
      <Code code={TAILWIND_SNIPPET} lang="css" title="app/globals.css" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('step3.title')}</h2>
      <Example code={FIRST_BUTTON_SNIPPET}>
        <Button variant="primary">Save</Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-12">{t('step4.title')}</h2>
      <p className="text-foreground/80 mb-2">
        {t.rich('step4.body', { code: codeTag, mono: monoTag })}
      </p>
      <Code code={ROOT_LAYOUT_SNIPPET} lang="tsx" title="app/layout.tsx" />

      <div className="mt-6 border-2 border-memphis bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
          {t('step4.validValuesEyebrow')}
        </div>
        <ul className="text-foreground/85 text-[14px] space-y-2 leading-relaxed">
          <li>{t.rich('step4.themeBullet', { mono: monoTag, strong: strongTag })}</li>
          <li>{t.rich('step4.paletteBullet', { mono: monoTag, strong: strongTag })}</li>
          <li>{t.rich('step4.densityBullet', { mono: monoTag })}</li>
        </ul>
      </div>

      <p className="text-foreground/80 mt-6 mb-0">
        {t.rich('themingHint', { link: linkTag('/docs/foundations/theming') })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <p className="text-foreground/80">
          {t.rich('ctaReady', {
            componentsLink: linkTag('/docs/components/button'),
            generatorLink: linkTag('/theme-generator'),
          })}
        </p>
        <Link
          href={BRAND.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          {t('viewOnGithub')}
        </Link>
      </div>
    </article>
  )
}
