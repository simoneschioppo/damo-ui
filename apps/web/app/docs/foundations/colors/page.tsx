import Link from 'next/link'
import { ColorScale, TokenSwatch } from '../../../_components/showcase'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { BRAND } from '../../../../lib/brand'

const PLUM_STOPS = [{ k: 900 }, { k: 800 }, { k: 700 }, { k: 500 }, { k: 300 }, { k: 100 }] as const
const GOLD_STOPS = [{ k: 500 }, { k: 400 }, { k: 300 }, { k: 200 }, { k: 100 }] as const
const PAPER_STOPS = [{ k: 300 }, { k: 200 }, { k: 100 }, { k: 50 }] as const

const SEMANTIC = [
  { name: 'Background', cssVar: '--background', usage: "Sfondo principale dell'app" },
  { name: 'Card', cssVar: '--card', usage: 'Card, modali, superfici elevate' },
  { name: 'Muted', cssVar: '--muted', usage: 'Superficie secondaria, hover' },
  { name: 'Foreground', cssVar: '--foreground', usage: 'Testo primario, bordi' },
  { name: 'Muted Foreground', cssVar: '--muted-foreground', usage: 'Testo secondario, hint' },
  { name: 'Primary', cssVar: '--primary', usage: 'Brand highlight (gold)' },
  { name: 'Secondary', cssVar: '--secondary', usage: 'Brand secondario (plum)' },
  { name: 'Memphis Border', cssVar: '--memphis-border-color', usage: 'Bordo Memphis 2px' },
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
    padding: 'var(--space-4)',
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
:root[data-palette='neon'] {
  --primary: #b6ff3c;
  --primary-foreground: #0a0a0a;
  --secondary: #ff2bd6;
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
  '--accent', '--accent-foreground',
  '--destructive', '--destructive-foreground',
  '--success', '--success-foreground',
  '--warning', '--warning-foreground',
  '--info', '--info-foreground',
  '--rage', '--rage-foreground',
  '--border', '--border-strong',
  '--input', '--ring',
  '--memphis-border-color', '--memphis-shadow-color',
] as const
`

export const metadata = { title: `Colors — ${BRAND.libName}` }

export default function ColorsFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Colors</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Three brand scales (Plum, Gold, Paper) and twenty+ semantic tokens. Switch the palette in
        the navbar to see every swatch on this page update live. Use the semantic layer in product
        code — it re-points automatically when theme or palette changes.
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {SEMANTIC.map((s) => (
          <TokenSwatch key={s.cssVar} name={s.name} cssVar={s.cssVar} usage={s.usage} />
        ))}
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">Using colors in JSX (Tailwind)</h2>
      <p className="text-foreground/80 mb-3">
        Every semantic token is exposed as a Tailwind utility:{' '}
        <code className="font-mono">bg-*</code>, <code className="font-mono">text-*</code>,{' '}
        <code className="font-mono">border-*</code>. Pair the bg with its matching foreground for
        guaranteed contrast.
      </p>
      <Example code={TAILWIND_BASIC} previewClassName="px-6 py-10 flex flex-col items-center gap-3">
        <div className="bg-card text-card-foreground border-2 border-memphis p-4 w-full max-w-sm">
          <h3 className="text-foreground font-display text-xl mb-1">Title</h3>
          <p className="text-muted-foreground">Subtitle</p>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 border-2 border-memphis"
            type="button"
          >
            Primary action
          </button>
          <button
            className="bg-secondary text-secondary-foreground px-4 py-2 border-2 border-memphis"
            type="button"
          >
            Secondary
          </button>
        </div>
      </Example>

      <h3 className="font-display text-lg mb-3 mt-8">Status colors</h3>
      <Example
        code={TAILWIND_STATUS}
        previewClassName="px-6 py-8 flex flex-wrap gap-3 justify-center"
      >
        <div className="bg-success text-success-foreground px-3 py-1.5 border-2 border-memphis">
          Saved
        </div>
        <div className="bg-warning text-warning-foreground px-3 py-1.5 border-2 border-memphis">
          Heads up
        </div>
        <div className="bg-destructive text-destructive-foreground px-3 py-1.5 border-2 border-memphis">
          Action failed
        </div>
        <div className="bg-info text-info-foreground px-3 py-1.5 border-2 border-memphis">FYI</div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Using colors in CSS</h2>
      <p className="text-foreground/80 mb-3">
        Need a color outside Tailwind&rsquo;s utilities? Read the variable directly.
      </p>
      <Code code={CSS_VAR_USAGE} lang="css" title="any stylesheet" />

      <h3 className="font-display text-lg mb-3 mt-8">Inline style fallback</h3>
      <Code code={REACT_INLINE} lang="tsx" title="JSX inline style" />

      <h2 className="font-display text-2xl mb-3 mt-10">Always pair bg + foreground</h2>
      <p className="text-foreground/80 mb-3">
        Each background semantic ships with a matching foreground variant. Mixing them is the only
        way to guarantee contrast across themes and custom palettes.
      </p>
      <Code code={FOREGROUND_PAIR_TIP} lang="tsx" title="contrast pairing" />

      <h2 className="font-display text-2xl mb-3 mt-10">Adding dark mode</h2>
      <p className="text-foreground/80 mb-3">
        The lib ships <strong>light only</strong>. Re-declare semantic tokens under{' '}
        <code className="font-mono">[data-theme=&apos;dark&apos;]</code> and the whole UI flips when
        the user toggles theme.
      </p>
      <Code code={DARK_OVERRIDE} lang="css" title="dark mode override" />

      <h2 className="font-display text-2xl mb-3 mt-10">Adding custom palettes</h2>
      <p className="text-foreground/80 mb-3">
        Same pattern with <code className="font-mono">data-palette</code>. Override only the tokens
        that should change — everything else inherits from the default palette.
      </p>
      <Code code={PALETTE_OVERRIDE} lang="css" title="palette override" />

      <h2 className="font-display text-2xl mb-3 mt-10">Full semantic token list</h2>
      <Code code={SEMANTIC_REFERENCE} lang="ts" title="reference" />

      <p className="text-foreground/80 mt-8">
        Full theming wiring (FOUC prevention, scoped islands, programmatic switching) →{' '}
        <Link href="/docs/foundations/theming" className="text-primary underline">
          Theming
        </Link>
        .
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/theming" className="text-primary underline">
          ← Theming
        </Link>
        <Link href="/docs/foundations/typography" className="text-primary underline">
          Typography →
        </Link>
      </div>
    </article>
  )
}
