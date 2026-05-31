/** `damo-ui init` — scaffold components.json so `add` knows where to write. */
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_CONFIG, detectSrcRoot, hasConfig, writeConfig } from '../lib/config.mjs'
import { c, log } from '../lib/log.mjs'

/** Locate the global stylesheet so the generated config points at a real file. */
function detectCssPath(cwd, srcRoot) {
  const candidates = [
    join(srcRoot, 'app/globals.css'),
    join(srcRoot, 'styles/globals.css'),
    'app/globals.css',
    'styles/globals.css',
  ].filter(Boolean)
  for (const rel of candidates) {
    if (existsSync(join(cwd, rel))) return rel
  }
  return srcRoot ? 'src/app/globals.css' : 'app/globals.css'
}

/** @param {object} opts { cwd, force, registry } */
export async function init(opts) {
  const { cwd } = opts
  if (hasConfig(cwd) && !opts.force) {
    log.warn('components.json already exists. Re-run with --force to overwrite.')
    return
  }

  const srcRoot = detectSrcRoot(cwd)
  const config = {
    ...DEFAULT_CONFIG,
    tailwind: { ...DEFAULT_CONFIG.tailwind, css: detectCssPath(cwd, srcRoot) },
  }
  // Record the registry so `add` resolves bare names without a flag.
  if (opts.registry) config.registries = { '@damo-ui': `${opts.registry}/{type}/{name}.json` }

  writeConfig(cwd, config)
  for (const dir of ['components/ui', 'lib', 'hooks']) {
    mkdirSync(join(cwd, srcRoot, dir), { recursive: true })
  }

  log.success(
    `Wrote ${c.bold('components.json')}${srcRoot ? c.dim(' (src/ layout detected)') : ''}`,
  )
  log.info('')
  log.info('Next steps:')
  log.info(`  ${c.cyan('damo-ui add button')}   ${c.dim('# copy a component (pulls cn + deps)')}`)
  log.info(`  ${c.cyan('damo-ui list')}         ${c.dim('# see everything available')}`)
}
