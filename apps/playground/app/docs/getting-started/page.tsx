import Link from 'next/link'
import { Button } from '@damo/ui'
import { Code } from '../_components/Code'
import { Example } from '../_components/Example'
import { BRAND } from '../../../lib/brand'

const NPMRC_SNIPPET = `# .npmrc — at the consumer repo root
@damo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}
`

const INSTALL_SNIPPET = `pnpm add @damo/ui
# or
npm install @damo/ui
# or
yarn add @damo/ui
`

const STYLES_SNIPPET = `// app/layout.tsx
import '@damo/ui/styles/tokens.css'
import '@damo/ui/styles/globals.css'
`

const TAILWIND_SNIPPET = `/* app/globals.css */
@import '@damo/ui/styles/tokens.css';
@import '@damo/ui/styles/globals.css';

@import 'tailwindcss';
@import '@damo/ui/styles/theme.css';

@source '../../node_modules/@damo/ui/dist/**/*.js';
`

const FIRST_BUTTON_SNIPPET = `import { Button } from '@damo/ui'

export default function Page() {
  return <Button variant="primary">Save</Button>
}
`

const THEMING_SNIPPET = `<html data-theme="dark" data-palette="neon" data-density="compact">
  <body>...</body>
</html>
`

export const metadata = {
  title: `Getting Started — ${BRAND.name}`,
  description: `Install ${BRAND.libName} and ship your first component.`,
}

export default function GettingStartedPage() {
  return (
    <article className="prose-sized">
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        GETTING STARTED
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">
        Install {BRAND.libName}
        <br />
        in five minutes.
      </h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-12">
        {BRAND.libName} is a React + Next.js component library inspired by Memphis design. Tokens,
        components, and patterns ready to compose into a product UI.
      </p>

      <h2 className="font-display text-2xl mb-3">1. Configure your registry</h2>
      <p className="text-foreground/80 mb-2">
        {BRAND.libName} is published to GitHub Packages. Add an{' '}
        <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">.npmrc</code> at
        your repo root pointing the{' '}
        <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">@damo</code>{' '}
        scope at it:
      </p>
      <Code code={NPMRC_SNIPPET} lang="bash" title=".npmrc" />

      <h2 className="font-display text-2xl mb-3 mt-12">2. Install the package</h2>
      <Code code={INSTALL_SNIPPET} lang="bash" title="terminal" />

      <h2 className="font-display text-2xl mb-3 mt-12">3. Wire the styles</h2>
      <p className="text-foreground/80 mb-2">
        Import the design tokens and the global stylesheet once in your root layout. Tokens define
        colors, typography, radius, shadow, and motion as CSS variables.
      </p>
      <Code code={STYLES_SNIPPET} lang="tsx" title="app/layout.tsx" />

      <p className="text-foreground/80 mt-6 mb-2">
        If you use Tailwind v4, replace your <code className="font-mono">globals.css</code> with:
      </p>
      <Code code={TAILWIND_SNIPPET} lang="css" title="app/globals.css" />

      <h2 className="font-display text-2xl mb-3 mt-12">4. Render your first component</h2>
      <Example code={FIRST_BUTTON_SNIPPET}>
        <Button variant="primary">Save</Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-12">5. Switch theme, palette, density</h2>
      <p className="text-foreground/80 mb-2">
        Three switchers live on{' '}
        <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">
          &lt;html&gt;
        </code>{' '}
        as data-attributes. All combinations work orthogonally.
      </p>
      <Code code={THEMING_SNIPPET} lang="html" title="<html> data-attributes" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <p className="text-foreground/80">
          Ready to compose? Browse{' '}
          <Link href="/docs/components/button" className="text-primary underline">
            components
          </Link>{' '}
          or{' '}
          <Link href="/theme-generator" className="text-primary underline">
            generate a custom theme
          </Link>
          .
        </p>
        <Link
          href={BRAND.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          View on GitHub →
        </Link>
      </div>
    </article>
  )
}
