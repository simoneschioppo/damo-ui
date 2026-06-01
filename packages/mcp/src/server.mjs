/**
 * damo-ui MCP server — exposes the component registry to AI coding agents
 * (Claude, Cursor, …) so they can discover and install components.
 *
 * `createServer()` builds the server without connecting a transport, so it can
 * be unit-/smoke-tested. The bin (`index.mjs`) wires it to stdio.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { createRegistryClient, formatItems } from './lib/registry-client.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const VERSION = JSON.parse(readFileSync(join(HERE, '../package.json'), 'utf8')).version

const DEFAULT_REGISTRY = (process.env.DAMO_UI_REGISTRY || 'https://damo-ui.com/r').replace(
  /\/+$/,
  '',
)
const DEFAULT_CLI = process.env.DAMO_UI_CLI || 'npx -y damo-ui'

const text = (t) => ({ content: [{ type: 'text', text: t }] })
const errorText = (t) => ({ content: [{ type: 'text', text: t }], isError: true })

/**
 * Build the MCP server with all damo-ui tools registered.
 * @param {{ registry?: string, cli?: string }} [opts]
 */
export function createServer({ registry = DEFAULT_REGISTRY, cli = DEFAULT_CLI } = {}) {
  const client = createRegistryClient(registry)
  const server = new McpServer({ name: 'damo-ui', version: VERSION || '0.0.0' })

  server.registerTool(
    'search_components',
    {
      title: 'Search damo-ui components',
      description: 'Search the damo-ui registry (components, utilities, hooks) by name or title.',
      inputSchema: { query: z.string().describe('Search text; empty string lists everything') },
    },
    async ({ query }) => text(formatItems(await client.search(query))),
  )

  server.registerTool(
    'get_component_code',
    {
      title: 'Get component source',
      description: 'Return the raw source files + npm dependencies of a damo-ui registry item.',
      inputSchema: { name: z.string().describe('Item name, e.g. "button"') },
    },
    async ({ name }) => {
      const item = await client.getItem(name)
      const body = (item.files ?? [])
        .map((f) => `// ${f.target ?? f.path}\n${f.content}`)
        .join('\n\n')
      const deps = (item.dependencies ?? []).join(', ') || 'none'
      const regDeps = (item.registryDependencies ?? []).join(', ') || 'none'
      return text(
        `# ${item.name} (${item.type})\nnpm deps: ${deps}\nregistry deps: ${regDeps}\n\n${body}`,
      )
    },
  )

  server.registerTool(
    'add_component',
    {
      title: 'Add a component to a project',
      description: 'Copy a damo-ui component (and its deps) into a project via the damo-ui CLI.',
      inputSchema: {
        name: z.string().describe('Component name'),
        project_path: z.string().describe('Absolute path to the target project'),
      },
    },
    async ({ name, project_path }) => {
      const [bin, ...pre] = cli.split(' ')
      const r = spawnSync(bin, [...pre, 'add', name, '--cwd', project_path, '--yes'], {
        encoding: 'utf8',
      })
      const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim()
      if (r.status !== 0) return errorText(`\`add ${name}\` failed (exit ${r.status}):\n${out}`)
      return text(`Added ${name} to ${project_path}.\n\n${out}`)
    },
  )

  server.registerTool(
    'list_blocks',
    {
      title: 'List composed blocks',
      description:
        'List composite/block-like components. damo-ui has no separate blocks namespace yet, so this returns composite UI items (cards, shells, headers).',
      inputSchema: {},
    },
    async () => {
      const items = await client.search('')
      const blocks = items.filter(
        (i) => i.type === 'registry:ui' && /(card|shell|header|top-bar|sidebar|page)/.test(i.name),
      )
      return text(
        `Composite components (no dedicated blocks namespace yet):\n${formatItems(blocks)}`,
      )
    },
  )

  server.registerTool(
    'get_theme_tokens',
    {
      title: 'Get theme tokens',
      description: 'Return the damo-ui design tokens / theme / global CSS (the base style item).',
      inputSchema: {},
    },
    async () => {
      const item = await client.getThemeTokens()
      const body = (item.files ?? [])
        .map((f) => `/* ${f.target ?? f.path} */\n${f.content}`)
        .join('\n\n')
      return text(body || 'No theme tokens found.')
    },
  )

  return server
}
