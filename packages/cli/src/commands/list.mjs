/** `damo-ui list` — show the components available in the registry. */
import { fetchJson } from '../lib/http.mjs'
import { subdirForType } from '../lib/registry.mjs'
import { c, log } from '../lib/log.mjs'

const GROUP_LABEL = {
  ui: 'Components',
  lib: 'Utilities',
  hooks: 'Hooks',
  themes: 'Themes',
}

/** @param {object} opts { registry } */
export async function list(opts) {
  const index = await fetchJson(`${opts.registry}/registry.json`)
  const items = index.items ?? []
  if (!items.length) {
    log.warn('Registry is empty.')
    return
  }

  const groups = new Map()
  for (const item of items) {
    const key = subdirForType(item.type)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }

  log.info(
    `${c.bold(index.name ?? 'registry')} ${c.dim(`· ${items.length} items · ${opts.registry}`)}\n`,
  )
  for (const key of ['ui', 'lib', 'hooks', 'themes']) {
    const list = groups.get(key)
    if (!list?.length) continue
    log.info(c.cyan(GROUP_LABEL[key] ?? key))
    for (const item of list.sort((a, b) => a.name.localeCompare(b.name))) {
      log.info(`  ${item.name}`)
    }
    log.info('')
  }
  log.info(c.dim('Add one with: ') + 'damo-ui add <name>')
}
