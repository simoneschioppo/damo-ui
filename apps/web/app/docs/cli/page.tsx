import { Code } from '../_components/Code'
import { BRAND } from '../../../lib/brand'

export const metadata = {
  title: `CLI — ${BRAND.libName}`,
  description: `Add ${BRAND.libName} components to your project shadcn-style with the damo-ui CLI.`,
}

const INIT_SNIPPET = `npx @axologic/cli init`

const ADD_SNIPPET = `# add components (pulls cn / icons / i18n + installs npm deps)
npx @axologic/cli add button dialog

# or straight from a URL
npx @axologic/cli add https://damo-ui.com/r/ui/button.json`

const LIST_SNIPPET = `npx @axologic/cli list`

const CONFIG_SNIPPET = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "tsx": true,
  "tailwind": { "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}`

const RESULT_SNIPPET = `components/ui/button/button.tsx
components/ui/button/button.variants.ts
components/ui/button/index.ts
lib/cn.ts            # pulled in automatically (transitive dependency)`

export default function CliPage() {
  return (
    <article className="prose-sized">
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        Copy-paste workflow
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">The damo-ui CLI</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-4">
        Prefer to <strong>own the source</strong> of your components instead of importing them from
        a package? The CLI copies each component straight into your codebase — shadcn-style — so you
        can read, tweak and version every line.
      </p>
      <p className="text-sm text-muted-foreground max-w-[60ch] mb-12">
        Both models are supported: keep using <code>npm install damo-ui</code> for the zero-config
        package, or use the CLI below for copy-paste. The CLI is <code>components.json</code>
        -compatible, so if you already use shadcn it will feel familiar.
      </p>

      <h2 className="font-display text-2xl mb-3">1. Initialize</h2>
      <p className="text-muted-foreground mb-2">
        Creates a <code>components.json</code> (it detects a <code>src/</code> layout and your
        global stylesheet automatically):
      </p>
      <Code code={INIT_SNIPPET} lang="bash" title="terminal" />
      <Code code={CONFIG_SNIPPET} lang="json" title="components.json" />

      <h2 className="font-display text-2xl mb-3 mt-12">2. Add components</h2>
      <p className="text-muted-foreground mb-2">
        <code>add</code> resolves a component and everything it needs — other components, the{' '}
        <code>cn</code> helper, the icon set, i18n — then installs the union of npm dependencies
        with your package manager:
      </p>
      <Code code={ADD_SNIPPET} lang="bash" title="terminal" />
      <p className="text-muted-foreground mb-2">
        Adding <code>button</code> writes, for example:
      </p>
      <Code code={RESULT_SNIPPET} lang="bash" title="result" />

      <h2 className="font-display text-2xl mb-3 mt-12">3. Browse the registry</h2>
      <Code code={LIST_SNIPPET} lang="bash" title="terminal" />

      <h2 className="font-display text-2xl mb-3 mt-12">Notes</h2>
      <ul className="text-muted-foreground list-disc pl-5 space-y-1 max-w-[60ch]">
        <li>
          Re-running <code>add</code> skips files that already exist — pass <code>--overwrite</code>{' '}
          to replace them.
        </li>
        <li>
          Pass <code>--no-deps</code> to skip installing npm packages, or{' '}
          <code>--registry &lt;url&gt;</code> to point at a different registry.
        </li>
        <li>Zero runtime dependencies — it only needs Node ≥ 18.</li>
      </ul>
    </article>
  )
}
