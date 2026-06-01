import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Code } from '../../_components/Code'
import { BRAND } from '../../../../lib/brand'
import { monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const ATTR_OVERVIEW = `<html data-theme="light" data-palette="default" data-density="normal">
  <body>...</body>
</html>`

const DARK_OVERRIDE = `/* app/globals.css */
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

const PALETTE_OVERRIDE = `/* app/globals.css — define a custom palette */
:root[data-palette='cyberpunk'] {
  --primary: #0f766e;
  --primary-foreground: #ffffff;
  --secondary: #7c4dff;
  --secondary-foreground: #ffffff;
}

/* Combine palette + dark mode by chaining the selectors */
:root[data-theme='dark'][data-palette='cyberpunk'] {
  --background: #170731;
  --foreground: #14b8a6;
}
`

const PROGRAMMATIC = `// Read & write any of the three attributes from JS:
const html = document.documentElement

html.dataset.theme = 'dark'         // applies dark vars
html.dataset.palette = 'cyberpunk'  // applies cyberpunk palette overrides
html.dataset.density = 'compact'    // applies density scale

// Persist for next visit:
localStorage.setItem('theme', 'dark')
localStorage.setItem('palette', 'cyberpunk')
localStorage.setItem('density', 'compact')
`

const SWITCHERS_USAGE = `import { AttrToggleGroup } from '@axologic/ui'

export function ThemeBar() {
  return (
    <div className="flex gap-3 items-center">
      <AttrToggleGroup
        label="Theme"
        storageKey="theme"
        attribute="data-theme"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        defaultValue="light"
      />
      <AttrToggleGroup
        label="Palette"
        variant="select"
        storageKey="palette"
        attribute="data-palette"
        options={[
          { value: 'default', label: 'Plum + Gold' },
          { value: 'cyberpunk', label: 'Cyberpunk' },
        ]}
        defaultValue="default"
      />
      <AttrToggleGroup
        label="Density"
        storageKey="density"
        attribute="data-density"
        options={[
          { value: 'compact', label: 'Compatta' },
          { value: 'normal', label: 'Normale' },
          { value: 'comfortable', label: 'Ampia' },
        ]}
        defaultValue="normal"
      />
    </div>
  )
}
`

const FOUC_FIX = `// app/layout.tsx — prevent flash of incorrect theme
// App Router note: render a synchronous inline <script> directly in <head>
// (NOT next/script with beforeInteractive — that strategy is not supported in
// App Router). The script body must be a hard-coded string literal so React's
// dangerouslySetInnerHTML never sees user-controlled content.

const PREFERENCES_INIT = \`(function(){try{var d=document.documentElement;\
var t=localStorage.getItem('theme');\
if(t==='light'||t==='dark')d.setAttribute('data-theme',t);\
var p=localStorage.getItem('palette');\
if(p==='default'||p==='sunset'||p==='cyberpunk'||p==='forest')d.setAttribute('data-palette',p);\
var n=localStorage.getItem('density');\
if(n==='compact'||n==='normal'||n==='comfortable')d.setAttribute('data-density',n)\
}catch(e){}})();\`

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-palette="default"
      data-density="normal"
      suppressHydrationWarning
    >
      <head>
        {/* Synchronous, allow-list validated. Must come before any stylesheet
            link so first paint sees the persisted preferences. */}
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_INIT }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

// Pair this with usePersistedAttr from damo-ui — its lazy-init useState makes
// React's first commit value match the script's DOM write, so the post-paint
// effect is a no-op instead of an undo.
`

const SCOPED_OVERRIDE = `// Scope a theme to a section instead of the whole page
<section data-theme="dark" className="bg-background text-foreground">
  {/* All children render in dark vars regardless of the page-level theme */}
  <h2>Dark island inside a light page</h2>
</section>
`

const VALID_DENSITY = `:root { --density-scale-y: 1 }                 /* normal (default) */
:root[data-density='compact']     { --density-scale-y: 0.75 }
:root[data-density='comfortable'] { --density-scale-y: 1.25 }
`

export const metadata = {
  title: `Theming — ${BRAND.libName}`,
  description: `Theme, palette, and density: how Damo UI lets one app run multiple visual identities at once.`,
}

export default async function ThemingFoundationPage() {
  const tFoundations = await getTranslations('foundations')
  const t = await getTranslations('foundations.theming')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tFoundations('eyebrow')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">{t('h1')}</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('lead', { mono: monoTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{t('switchersTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('switchersBody')}</p>
      <Code code={ATTR_OVERVIEW} lang="html" title="<html> data-attributes" />

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="border-2 border-memphis bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-1">
            data-theme
          </div>
          <div className="font-display text-base mb-2">{t('themeCardLabel')}</div>
          <p className="text-[13px] text-muted-foreground">
            {t.rich('themeCardBody', { strong: strongTag, em: emTag })}
          </p>
        </div>
        <div className="border-2 border-memphis bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-1">
            data-palette
          </div>
          <div className="font-display text-base mb-2">{t('paletteCardLabel')}</div>
          <p className="text-[13px] text-muted-foreground">
            {t.rich('paletteCardBody', { mono: monoTag })}
          </p>
        </div>
        <div className="border-2 border-memphis bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-1">
            data-density
          </div>
          <div className="font-display text-base mb-2">{t('densityCardLabel')}</div>
          <p className="text-[13px] text-muted-foreground">
            {t.rich('densityCardBody', { mono: monoTag })}
          </p>
        </div>
      </div>

      <h2 className="font-display text-2xl mb-3 mt-12">{t('darkTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('darkBody', { mono: monoTag })}</p>
      <Code code={DARK_OVERRIDE} lang="css" title="dark mode override" />
      <p className="text-foreground/70 mt-4 text-[14px]">
        {t.rich('darkRefList', {
          colorsLink: linkTag('/docs/foundations/colors'),
          tokensLink: linkTag('/docs/foundations/tokens'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3 mt-12">{t('customPaletteTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('customPaletteBody')}</p>
      <Code code={PALETTE_OVERRIDE} lang="css" title="palette override + dark combo" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('densityScaleTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('densityScaleBody')}</p>
      <Code code={VALID_DENSITY} lang="css" title="density tokens (lib defaults)" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('dropInTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('dropInBody', { mono: monoTag })}</p>
      <Code code={SWITCHERS_USAGE} lang="tsx" title="components/ThemeBar.tsx" />
      <p className="text-foreground/70 mt-4 text-[14px]">
        {t.rich('dropInPropsLink', { link: linkTag('/docs/components/attr-toggle-group') })}
      </p>

      <h2 className="font-display text-2xl mb-3 mt-12">{t('programmaticTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t('programmaticBody')}</p>
      <Code code={PROGRAMMATIC} lang="ts" title="any client component" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('fouTitle')}</h2>
      <p className="text-foreground/80 mb-3">{t.rich('fouBody', { mono: monoTag })}</p>
      <Code code={FOUC_FIX} lang="tsx" title="app/layout.tsx" />

      <h2 className="font-display text-2xl mb-3 mt-12">{t('scopedTitle')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('scopedBody', { mono: monoTag, em: emTag })}
      </p>
      <Code code={SCOPED_OVERRIDE} lang="tsx" title="scoped theme island" />

      <div className="mt-12 border-2 border-memphis bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
          {t('tipEyebrow')}
        </div>
        <p className="text-foreground/85 text-[14px] leading-relaxed">
          {t.rich('tipBody', { link: linkTag('/theme-generator') })}
        </p>
      </div>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/tokens" className="text-primary underline">
          {t('prevLink')}
        </Link>
        <Link href="/docs/foundations/colors" className="text-primary underline">
          {t('nextLink')}
        </Link>
      </div>
    </article>
  )
}
