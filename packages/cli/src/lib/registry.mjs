/**
 * Registry resolution: turn a component name or URL into the full set of
 * registry items to install, following `registryDependencies` transitively.
 *
 * Network access is injected (`fetchJson`) so the resolution logic is pure and
 * unit-testable without hitting a server.
 *
 * @typedef {Object} RegistryFile
 * @property {string} path
 * @property {string} type
 * @property {string} [target]
 * @property {string} content
 *
 * @typedef {Object} RegistryItem
 * @property {string} name
 * @property {string} type
 * @property {string} [title]
 * @property {string[]} [dependencies]
 * @property {string[]} [registryDependencies]
 * @property {RegistryFile[]} [files]
 */

/** Map a registry item type to its URL/subdirectory namespace. */
export function subdirForType(type) {
  if (type === 'registry:lib') return 'lib'
  if (type === 'registry:hook') return 'hooks'
  if (type === 'registry:style' || type === 'registry:theme') return 'themes'
  return 'ui'
}

/** Is this string an absolute http(s) URL? */
export function isUrl(s) {
  return /^https?:\/\//.test(s)
}

/**
 * Resolve a component reference (bare name or absolute URL) to its item URL.
 * Bare names are located via the registry index (to learn their type), falling
 * back to the `ui` namespace when absent.
 *
 * @param {string} ref
 * @param {string} base registry base URL (no trailing slash)
 * @param {{name: string, type: string}[]} indexItems
 * @returns {string}
 */
export function resolveItemUrl(ref, base, indexItems = []) {
  if (isUrl(ref)) return ref
  const entry = indexItems.find((i) => i.name === ref)
  const sub = entry ? subdirForType(entry.type) : 'ui'
  return `${base}/${sub}/${ref}.json`
}

/**
 * Breadth-first closure over `registryDependencies`, returning every unique
 * item needed, dependencies first. Cycles and repeats are handled via the
 * visited set keyed on URL.
 *
 * @param {string[]} startUrls
 * @param {(url: string) => Promise<RegistryItem>} fetchJson
 * @returns {Promise<RegistryItem[]>}
 */
export async function collectClosure(startUrls, fetchJson) {
  const seen = new Set()
  const order = []
  const queue = [...startUrls]
  while (queue.length) {
    const url = queue.shift()
    if (seen.has(url)) continue
    seen.add(url)
    const item = await fetchJson(url)
    order.push(item)
    for (const dep of item.registryDependencies ?? []) {
      if (!seen.has(dep)) queue.push(dep)
    }
  }
  return order
}

/**
 * Union of npm `dependencies` across items, de-duplicated by package name
 * (keeping the first-seen version specifier).
 *
 * @param {RegistryItem[]} items
 * @returns {string[]}
 */
export function aggregateNpmDeps(items) {
  const byName = new Map()
  for (const item of items) {
    for (const spec of item.dependencies ?? []) {
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('@')[0]
      if (!byName.has(name)) byName.set(name, spec)
    }
  }
  return [...byName.values()].sort()
}
