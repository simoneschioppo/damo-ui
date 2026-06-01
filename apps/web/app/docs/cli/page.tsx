import { Code } from '../_components/Code'
import { BRAND } from '../../../lib/brand'

export const metadata = {
  title: `CLI — ${BRAND.libName}`,
  description: `Add ${BRAND.libName} components to your project shadcn-style with the damo-ui CLI.`,
}

const INIT_SNIPPET = `npx damo-ui init`

const ADD_SNIPPET = `# add components (pulls cn / icons / i18n + installs npm deps)
npx damo-ui add button dialog

# or straight from a URL
npx damo-ui add https://damo-ui.com/r/ui/button.json`

const LIST_SNIPPET = `npx damo-ui list`

const MIGRATE_SNIPPET = `# preview the changes first
npx damo-ui codemod migrate-from-npm --dry-run

# then apply
npx damo-ui codemod migrate-from-npm`

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

const MCP_SNIPPET = `// .mcp.json (Claude Code) — or ~/.cursor/mcp.json (Cursor)
{
  "mcpServers": {
    "damo-ui": { "command": "npx", "args": ["-y", "@axologic/mcp"] }
  }
}`

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
        There&apos;s no component-library package to install — the CLI copies the source into your
        project and you import it from <code>@/components/ui/*</code>. The CLI is{' '}
        <code>components.json</code>-compatible, so if you already use shadcn it will feel familiar.
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

      <h2 className="font-display text-2xl mb-3 mt-12">Already on the npm package?</h2>
      <p className="text-muted-foreground mb-2">
        If you import from <code>damo-ui</code> today, one command converts the whole project to
        copy-paste — it rewrites every import (named, type-only, aliased, mixed), copies the used
        components, and drops <code>damo-ui</code> from <code>package.json</code>. It is idempotent
        and TypeScript-aware; preview with <code>--dry-run</code> first.
      </p>
      <Code code={MIGRATE_SNIPPET} lang="bash" title="terminal" />

      <h2 className="font-display text-2xl mb-3 mt-12">For AI agents (MCP)</h2>
      <p className="text-muted-foreground mb-2">
        There&apos;s also an <a href="https://modelcontextprotocol.io">MCP</a> server,{' '}
        <code>@axologic/mcp</code>, so agents like Claude Code or Cursor can search, read, and add
        components for you. Point your client at it:
      </p>
      <Code code={MCP_SNIPPET} lang="json" title=".mcp.json" />

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
        <li>
          The <code>init</code> / <code>add</code> / <code>list</code> commands need only Node ≥ 18;
          the codemod additionally uses <code>ts-morph</code> for the AST rewrite.
        </li>
      </ul>
    </article>
  )
}
