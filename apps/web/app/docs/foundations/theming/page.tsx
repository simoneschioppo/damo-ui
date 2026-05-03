import Link from 'next/link'
import { Code } from '../../_components/Code'
import { BRAND } from '../../../../lib/brand'

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
:root[data-palette='neon'] {
  --primary: #b6ff3c;
  --primary-foreground: #0a0a0a;
  --secondary: #ff2bd6;
  --secondary-foreground: #ffffff;
}

/* Combine palette + dark mode by chaining the selectors */
:root[data-theme='dark'][data-palette='neon'] {
  --background: #050505;
  --foreground: #b6ff3c;
}
`

const PROGRAMMATIC = `// Read & write any of the three attributes from JS:
const html = document.documentElement

html.dataset.theme = 'dark'        // applies dark vars
html.dataset.palette = 'neon'      // applies neon palette overrides
html.dataset.density = 'compact'   // applies density scale

// Persist for next visit:
localStorage.setItem('theme', 'dark')
localStorage.setItem('palette', 'neon')
localStorage.setItem('density', 'compact')
`

const SWITCHERS_USAGE = `import { ThemeSwitcher, PaletteSwitcher, DensitySwitcher } from '@damo/ui'

export function ThemeBar() {
  return (
    <div className="flex gap-3 items-center">
      <ThemeSwitcher />
      <PaletteSwitcher
        defaultValue="default"
        options={[
          { value: 'default', label: 'Plum + Gold' },
          { value: 'neon', label: 'Neon' },
        ]}
      />
      <DensitySwitcher />
    </div>
  )
}
`

const FOUC_FIX = `// app/layout.tsx — prevent flash of incorrect theme
import Script from 'next/script'

const restore = \`(() => {
  try {
    const html = document.documentElement
    const t = localStorage.getItem('theme')
    const p = localStorage.getItem('palette')
    const d = localStorage.getItem('density')
    if (t) html.setAttribute('data-theme', t)
    if (p) html.setAttribute('data-palette', p)
    if (d) html.setAttribute('data-density', d)
  } catch {}
})()\`

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
        {/* Run BEFORE React hydrates — strategy="beforeInteractive" */}
        <Script id="theme-restore" strategy="beforeInteractive">
          {restore}
        </Script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
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

export default function ThemingFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Theming</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Three orthogonal data-attributes on <code className="font-mono">&lt;html&gt;</code> drive
        every visual choice. Switch one without touching the others, define your own variants on top
        of the lib&rsquo;s neutral defaults, and persist the user&rsquo;s preference across reloads.
      </p>

      <h2 className="font-display text-2xl mb-3">The three switchers</h2>
      <p className="text-foreground/80 mb-3">
        {BRAND.libName} reads three independent attributes from the document root. They cascade
        through every component because the design tokens are CSS variables.
      </p>
      <Code code={ATTR_OVERVIEW} lang="html" title="<html> data-attributes" />

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="border-2 border-memphis bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-1">
            data-theme
          </div>
          <div className="font-display text-base mb-2">Light / Dark</div>
          <p className="text-[13px] text-muted-foreground">
            Toggles surfaces, foreground, and Memphis chrome. The lib ships{' '}
            <strong className="text-foreground">light only</strong> — <em>you</em> declare the dark
            override.
          </p>
        </div>
        <div className="border-2 border-memphis bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-1">
            data-palette
          </div>
          <div className="font-display text-base mb-2">Brand variants</div>
          <p className="text-[13px] text-muted-foreground">
            No built-in values — declare any list you want (
            <code className="font-mono">default</code>, <code className="font-mono">neon</code>,{' '}
            <code className="font-mono">sunset</code>…) and override{' '}
            <code className="font-mono">--primary</code> &amp; friends per palette.
          </p>
        </div>
        <div className="border-2 border-memphis bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-1">
            data-density
          </div>
          <div className="font-display text-base mb-2">compact / normal / comfortable</div>
          <p className="text-[13px] text-muted-foreground">
            Multiplies vertical spacing via <code className="font-mono">--density-scale-y</code>.
            Lib ships these three values out of the box.
          </p>
        </div>
      </div>

      <h2 className="font-display text-2xl mb-3 mt-12">1. Adding dark mode</h2>
      <p className="text-foreground/80 mb-3">
        Re-declare every public token under{' '}
        <code className="font-mono">[data-theme=&apos;dark&apos;]</code>. You only need to override
        the semantic layer — components consume those, never the raw scales directly.
      </p>
      <Code code={DARK_OVERRIDE} lang="css" title="dark mode override" />
      <p className="text-foreground/70 mt-4 text-[14px]">
        The full list of tokens you can override lives in{' '}
        <Link href="/docs/foundations/colors" className="text-primary underline">
          Colors
        </Link>{' '}
        (semantic) and{' '}
        <Link href="/docs/foundations/tokens" className="text-primary underline">
          Tokens
        </Link>{' '}
        (architecture).
      </p>

      <h2 className="font-display text-2xl mb-3 mt-12">2. Adding custom palettes</h2>
      <p className="text-foreground/80 mb-3">
        Same pattern, different attribute. You can scope a palette to a single mode by chaining
        attribute selectors.
      </p>
      <Code code={PALETTE_OVERRIDE} lang="css" title="palette override + dark combo" />

      <h2 className="font-display text-2xl mb-3 mt-12">3. Density scale</h2>
      <p className="text-foreground/80 mb-3">
        Density flips a single CSS variable that components multiply into their vertical padding.
        You can change the multipliers globally if the defaults don&rsquo;t suit your product.
      </p>
      <Code code={VALID_DENSITY} lang="css" title="density tokens (lib defaults)" />

      <h2 className="font-display text-2xl mb-3 mt-12">4. Drop-in switcher components</h2>
      <p className="text-foreground/80 mb-3">
        The lib ships three controls that read &amp; write the attributes and persist to{' '}
        <code className="font-mono">localStorage</code>. Pop them anywhere — the navbar is the most
        common home.
      </p>
      <Code code={SWITCHERS_USAGE} lang="tsx" title="components/ThemeBar.tsx" />
      <p className="text-foreground/70 mt-4 text-[14px]">
        Full props in{' '}
        <Link href="/docs/components/theme-switcher" className="text-primary underline">
          Theme Switchers
        </Link>
        .
      </p>

      <h2 className="font-display text-2xl mb-3 mt-12">5. Programmatic switching</h2>
      <p className="text-foreground/80 mb-3">
        If the built-in components don&rsquo;t fit (custom UI, settings page, system-preference
        media query, A/B test…) flip the attributes by hand:
      </p>
      <Code code={PROGRAMMATIC} lang="ts" title="any client component" />

      <h2 className="font-display text-2xl mb-3 mt-12">6. Preventing the flash</h2>
      <p className="text-foreground/80 mb-3">
        Server-rendered apps render the default theme first, then React hydrates the persisted
        choice. To avoid the flash of unstyled-theme (FOUT), restore the attributes from{' '}
        <code className="font-mono">localStorage</code> in a blocking script before hydration.
      </p>
      <Code code={FOUC_FIX} lang="tsx" title="app/layout.tsx" />

      <h2 className="font-display text-2xl mb-3 mt-12">7. Scoped islands</h2>
      <p className="text-foreground/80 mb-3">
        The attributes work on <em>any</em> element, not only{' '}
        <code className="font-mono">&lt;html&gt;</code>. Wrap a section in{' '}
        <code className="font-mono">data-theme=&quot;dark&quot;</code> to flip just that subtree.
      </p>
      <Code code={SCOPED_OVERRIDE} lang="tsx" title="scoped theme island" />

      <div className="mt-12 border-2 border-memphis bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
          Tip
        </div>
        <p className="text-foreground/85 text-[14px] leading-relaxed">
          The{' '}
          <Link href="/theme-generator" className="text-primary underline">
            Theme Generator
          </Link>{' '}
          authors light + dark variants visually and exports the CSS overrides for steps 1 and 2.
          Skip the manual hex hunt.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/tokens" className="text-primary underline">
          ← Tokens
        </Link>
        <Link href="/docs/foundations/colors" className="text-primary underline">
          Colors →
        </Link>
      </div>
    </article>
  )
}
