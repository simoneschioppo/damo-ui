#!/usr/bin/env node
/**
 * damo-ui CLI — add Memphis-flavoured shadcn-style components to your project.
 *
 * Commands: init · add <component...> · list
 * A focused, dependency-free reimplementation of the shadcn CLI workflow,
 * compatible with the `components.json` schema. See NOTICE for attribution.
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { init } from './commands/init.mjs'
import { add } from './commands/add.mjs'
import { list } from './commands/list.mjs'
import { c, log } from './lib/log.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = JSON.parse(readFileSync(join(HERE, '../package.json'), 'utf8'))
const DEFAULT_REGISTRY = (process.env.DAMO_UI_REGISTRY || 'https://damo-ui.com/r').replace(
  /\/+$/,
  '',
)

const HELP = `${c.bold('damo-ui')} — shadcn-style component CLI for damo-ui

${c.bold('Usage')}
  damo-ui <command> [options]

${c.bold('Commands')}
  init                 Create components.json in the current project
  add <component...>   Add components (with their deps) to your project
  list                 List components available in the registry

${c.bold('Options')}
  -r, --registry <url> Registry base URL (default: ${DEFAULT_REGISTRY})
      --cwd <dir>      Project directory (default: .)
      --overwrite      Overwrite files that already exist (add)
      --no-deps        Do not install npm dependencies (add)
  -f, --force          Overwrite an existing components.json (init)
  -y, --yes            Skip prompts / assume defaults
  -h, --help           Show this help
  -v, --version        Show version

${c.bold('Examples')}
  damo-ui init
  damo-ui add button dialog
  damo-ui add ${DEFAULT_REGISTRY}/ui/button.json
  damo-ui list`

const OPTIONS = {
  registry: { type: 'string', short: 'r' },
  cwd: { type: 'string' },
  overwrite: { type: 'boolean', default: false },
  force: { type: 'boolean', short: 'f', default: false },
  yes: { type: 'boolean', short: 'y', default: false },
  help: { type: 'boolean', short: 'h', default: false },
  version: { type: 'boolean', short: 'v', default: false },
}

async function main() {
  // `--no-deps` is handled manually: util.parseArgs negation support varies by
  // Node version, so strip it ourselves before parsing.
  const rawArgs = process.argv.slice(2)
  const noDeps = rawArgs.includes('--no-deps')
  const args = rawArgs.filter((a) => a !== '--no-deps')

  const { values, positionals } = parseArgs({
    args,
    options: OPTIONS,
    allowPositionals: true,
  })

  if (values.version) return console.log(PKG.version)
  const [command, ...rest] = positionals
  if (values.help || !command) return console.log(HELP)

  const opts = {
    cwd: values.cwd ? resolve(process.cwd(), values.cwd) : process.cwd(),
    registry: (values.registry || DEFAULT_REGISTRY).replace(/\/+$/, ''),
    overwrite: values.overwrite,
    deps: !noDeps,
    force: values.force,
    yes: values.yes,
  }

  switch (command) {
    case 'init':
      return init(opts)
    case 'add':
      return add(rest, opts)
    case 'list':
      return list(opts)
    default:
      log.error(`Unknown command: ${command}`)
      console.log(`\n${HELP}`)
      process.exitCode = 1
  }
}

main().catch((err) => {
  log.error(err.message)
  process.exitCode = 1
})
