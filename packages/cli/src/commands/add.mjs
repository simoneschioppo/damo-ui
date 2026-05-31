/** `damo-ui add <component...>` — copy components (and their transitive
 * registry + npm dependencies) into the consumer project. */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { readConfig, detectSrcRoot } from '../lib/config.mjs'
import { fetchJson } from '../lib/http.mjs'
import { aggregateNpmDeps, collectClosure, resolveItemUrl } from '../lib/registry.mjs'
import { targetToProjectPath } from '../lib/paths.mjs'
import { detectPackageManager, installDeps } from '../lib/pm.mjs'
import { c, log } from '../lib/log.mjs'

/**
 * @param {string[]} names component names or registry URLs
 * @param {object} opts { cwd, registry, overwrite, deps, yes }
 */
export async function add(names, opts) {
  const { cwd, registry } = opts
  if (!names.length) throw new Error('Specify at least one component, e.g. `damo-ui add button`')

  const config = readConfig(cwd)
  if (!config) {
    throw new Error('No components.json found. Run `damo-ui init` first.')
  }
  const srcRoot = detectSrcRoot(cwd)
  const aliases = config.aliases ?? {}

  // Resolve each requested ref to a URL (bare names need the index for type).
  const index = await fetchJson(`${registry}/registry.json`).catch(() => ({ items: [] }))
  const startUrls = names.map((n) => resolveItemUrl(n, registry, index.items ?? []))

  log.step(`Resolving ${names.map((n) => c.bold(n)).join(', ')} from ${c.dim(registry)}`)
  const items = await collectClosure(startUrls, fetchJson)
  log.step(`${items.length} item(s) to install (incl. dependencies)`)

  // Write files.
  let written = 0
  let skipped = 0
  for (const item of items) {
    for (const file of item.files ?? []) {
      const target = file.target ?? file.path
      const rel = targetToProjectPath(target, { aliases, srcRoot })
      const abs = join(cwd, rel)
      if (existsSync(abs) && !opts.overwrite) {
        skipped++
        log.warn(`skip ${c.dim(rel)} (exists — use --overwrite)`)
        continue
      }
      mkdirSync(dirname(abs), { recursive: true })
      writeFileSync(abs, file.content)
      written++
      log.success(`add  ${rel}`)
    }
  }

  // Install npm dependencies.
  const deps = aggregateNpmDeps(items)
  if (deps.length && opts.deps) {
    const pm = detectPackageManager(cwd)
    log.step(`Installing ${deps.length} npm dependenc(ies) with ${c.bold(pm)}…`)
    const { status } = installDeps(deps, cwd, pm)
    if (status !== 0) {
      log.warn(
        `Dependency install exited non-zero. Install manually:\n  ${pm} install ${deps.join(' ')}`,
      )
    }
  } else if (deps.length) {
    log.info(`\nnpm dependencies (install skipped):\n  ${deps.join('\n  ')}`)
  }

  log.info('')
  log.success(`Done — ${written} file(s) written${skipped ? `, ${skipped} skipped` : ''}.`)
}
