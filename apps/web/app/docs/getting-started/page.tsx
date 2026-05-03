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

const ROOT_LAYOUT_SNIPPET = `// app/layout.tsx
import {
  AppTopBar,
  ThemeSwitcher,
  PaletteSwitcher,
  DensitySwitcher,
} from '@damo/ui'

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
              <ThemeSwitcher />
              <PaletteSwitcher
                defaultValue="default"
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'neon',    label: 'Neon' },
                ]}
              />
              <DensitySwitcher />
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

      <h2 className="font-display text-2xl mb-3 mt-12">5. Wire theme, palette, density</h2>
      <p className="text-foreground/80 mb-2">
        Three orthogonal data-attributes on{' '}
        <code className="font-mono bg-muted px-1.5 py-0.5 border border-memphis/40">
          &lt;html&gt;
        </code>{' '}
        drive every visual choice. Drop the lib&rsquo;s switcher components in your top bar and
        you&rsquo;re done — they read &amp; write the attributes and persist to{' '}
        <code className="font-mono">localStorage</code>:
      </p>
      <Code code={ROOT_LAYOUT_SNIPPET} lang="tsx" title="app/layout.tsx" />

      <div className="mt-6 border-2 border-memphis bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
          Valid attribute values
        </div>
        <ul className="text-foreground/85 text-[14px] space-y-2 leading-relaxed">
          <li>
            <code className="font-mono">data-theme</code> — the lib ships{' '}
            <strong>light only</strong>; declare your own{' '}
            <code className="font-mono">[data-theme=&apos;dark&apos;]</code> CSS overrides. The
            built-in <code className="font-mono">ThemeSwitcher</code> defaults to{' '}
            <code className="font-mono">&apos;light&apos;</code> /{' '}
            <code className="font-mono">&apos;dark&apos;</code>.
          </li>
          <li>
            <code className="font-mono">data-palette</code> — <strong>no built-ins</strong>; the
            lib&rsquo;s neutral defaults assume a single palette. Define{' '}
            <code className="font-mono">[data-palette=&apos;neon&apos;]</code>,{' '}
            <code className="font-mono">[data-palette=&apos;sunset&apos;]</code>, etc., and pass the
            list to <code className="font-mono">PaletteSwitcher</code>.
          </li>
          <li>
            <code className="font-mono">data-density</code> — built-in:{' '}
            <code className="font-mono">&apos;compact&apos;</code>,{' '}
            <code className="font-mono">&apos;normal&apos;</code>,{' '}
            <code className="font-mono">&apos;comfortable&apos;</code>. Drives{' '}
            <code className="font-mono">--density-scale-y</code> for vertical spacing.
          </li>
        </ul>
      </div>

      <p className="text-foreground/80 mt-6 mb-0">
        Full guide with dark-mode setup, custom palettes, programmatic switching, and FOUC
        prevention →{' '}
        <Link href="/docs/foundations/theming" className="text-primary underline">
          Theming
        </Link>
        .
      </p>

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
