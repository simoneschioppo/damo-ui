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

const HTML_SNIPPET = `<html data-theme="dark" data-palette="neon" data-density="compact">
  <body>...</body>
</html>`

export const metadata = { title: `Tokens — ${BRAND.name}` }

export default function TokensFoundationPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FOUNDATIONS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Tokens</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Damo UI uses a three-layer token architecture. Raw scales are private; semantic pairs are
        the public surface; identity tokens are component-specific overrides. Every token is a CSS
        variable so theme, palette, and density switch live without rebuilds.
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

      <h2 className="font-display text-2xl mb-3 mt-10">3. Identity tokens</h2>
      <p className="text-foreground/80 mb-3">
        Component-specific overrides. They reference the semantic layer but allow narrow adjustments
        — <code className="font-mono">--nav-on-dark-*</code>,{' '}
        <code className="font-mono">--badge-*</code>, <code className="font-mono">--chart-*</code>.
      </p>
      <Code code={IDENTITY_SNIPPET} lang="css" title="identity" />

      <h2 className="font-display text-2xl mb-3 mt-10">Switching modes</h2>
      <p className="text-foreground/80 mb-3">
        Three switchers live on <code className="font-mono">&lt;html&gt;</code>. They are
        orthogonal: any combination works.
      </p>
      <Code code={HTML_SNIPPET} lang="html" />

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
        <Link href="/docs/foundations/colors" className="text-primary underline">
          Colors →
        </Link>
      </div>
    </article>
  )
}
