import Link from 'next/link'
import { Code } from '../../_components/Code'
import { BRAND } from '../../../../lib/brand'

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

export default function TokensFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Tokens</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {BRAND.libName} uses a three-layer token architecture. Raw scales are private; semantic
        pairs are the public surface; identity tokens are component-specific overrides. Every token
        is a CSS variable so theme, palette, and density switch live without rebuilds.
      </p>

      <h2 className="font-display text-2xl mb-3">1. Raw palette (private)</h2>
      <p className="text-foreground/80 mb-3">
        Numeric scales like <code className="font-mono">--plum-*</code>,{' '}
        <code className="font-mono">--gold-*</code>, <code className="font-mono">--paper-*</code>.
        These power the semantic layer but are <em>not</em> exposed as Tailwind utilities — using
        them directly couples your code to brand specifics.
      </p>
      <Code code={RAW_SNIPPET} lang="css" title="raw" />

      <h2 className="font-display text-2xl mb-3 mt-10">2. Semantic tokens (public)</h2>
      <p className="text-foreground/80 mb-3">
        Paired <code className="font-mono">bg</code>/<code className="font-mono">fg</code> pairs:{' '}
        <code className="font-mono">--background</code> +{' '}
        <code className="font-mono">--foreground</code>,{' '}
        <code className="font-mono">--primary</code> +{' '}
        <code className="font-mono">--primary-foreground</code>, etc. This is the layer product code
        should consume.
      </p>
      <Code code={SEMANTIC_SNIPPET} lang="css" title="semantic" />

      <h3 className="font-display text-lg mb-3 mt-8">Consuming semantic tokens</h3>
      <p className="text-foreground/80 mb-3">
        Three equivalent ways. Pick the one that fits where you are:
      </p>
      <Code code={SEMANTIC_TAILWIND} lang="tsx" title="JSX · Tailwind utilities (recommended)" />
      <Code code={SEMANTIC_CSS} lang="css" title="CSS · var() reference" />
      <Code code={SEMANTIC_INLINE} lang="tsx" title="JSX · inline style" />

      <h2 className="font-display text-2xl mb-3 mt-10">3. Identity tokens</h2>
      <p className="text-foreground/80 mb-3">
        Component-specific overrides. They reference the semantic layer but allow narrow adjustments
        — <code className="font-mono">--nav-on-dark-*</code>,{' '}
        <code className="font-mono">--badge-*</code>, <code className="font-mono">--chart-*</code>.
        Add your own when a component needs a value the semantic layer doesn&rsquo;t express.
      </p>
      <Code code={IDENTITY_SNIPPET} lang="css" title="identity" />

      <h3 className="font-display text-lg mb-3 mt-8">Adding a custom identity token</h3>
      <Code code={NEW_IDENTITY_TOKEN} lang="css" title="define + theme + consume" />

      <h2 className="font-display text-2xl mb-3 mt-10">Overriding tokens</h2>
      <p className="text-foreground/80 mb-3">
        Any token is just a CSS variable. Override at <code className="font-mono">:root</code> to
        change the whole document, or scope to a wrapper class for an island:
      </p>
      <Code code={OVERRIDE_ROOT} lang="css" title="root override" />
      <Code code={OVERRIDE_SCOPED} lang="css" title="scoped override" />

      <h2 className="font-display text-2xl mb-3 mt-10">Density &amp; the multiplier pattern</h2>
      <p className="text-foreground/80 mb-3">
        The density attribute flips a single multiplier:{' '}
        <code className="font-mono">--density-scale-y</code>. Bake it into your component spacing
        and density switching becomes free.
      </p>
      <Code code={DENSITY_USAGE} lang="css" title="density-scale-y in product CSS" />

      <h2 className="font-display text-2xl mb-3 mt-10">Switching modes</h2>
      <p className="text-foreground/80 mb-3">
        Three switchers live on <code className="font-mono">&lt;html&gt;</code>:{' '}
        <code className="font-mono">data-theme</code>,{' '}
        <code className="font-mono">data-palette</code>,{' '}
        <code className="font-mono">data-density</code>. They are orthogonal — any combination
        works. See{' '}
        <Link href="/docs/foundations/theming" className="text-primary underline">
          Theming
        </Link>{' '}
        for the full wiring.
      </p>

      <p className="text-foreground/80 mt-6">
        Want to author a custom theme? The{' '}
        <Link href="/theme-generator" className="text-primary underline">
          Theme Generator
        </Link>{' '}
        edits all three layers visually and exports CSS, Tailwind, or JSON.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/getting-started" className="text-primary underline">
          ← Getting Started
        </Link>
        <Link href="/docs/foundations/theming" className="text-primary underline">
          Theming →
        </Link>
      </div>
    </article>
  )
}
