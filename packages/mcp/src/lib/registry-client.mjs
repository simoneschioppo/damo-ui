/**
 * Read-only client for the damo-ui registry, used by the MCP tools.
 * Pure list/format helpers are separated from the network calls so they
 * unit-test without a server.
 */

/** Registry type → URL namespace. */
export function subdir(type) {
  if (type === 'registry:lib') return 'lib'
  if (type === 'registry:hook') return 'hooks'
  if (type === 'registry:style' || type === 'registry:theme') return 'themes'
  return 'ui'
}

/**
 * Filter registry index items by a free-text query against name + title.
 * Empty query returns everything.
 *
 * @param {{name:string,title?:string,type:string}[]} items
 * @param {string} [query]
 */
export function filterComponents(items, query) {
  if (!query) return items
  const q = query.toLowerCase()
  return items.filter(
    (i) => i.name.toLowerCase().includes(q) || (i.title ?? '').toLowerCase().includes(q),
  )
}

/** One-line-per-item rendering for tool text output. */
export function formatItems(items) {
  if (!items.length) return 'No matching components.'
  return items
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => `- ${i.name} (${i.type})${i.title ? ` — ${i.title}` : ''}`)
    .join('\n')
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`)
  return res.json()
}

export function createRegistryClient(base) {
  const root = base.replace(/\/+$/, '')
  let indexCache = null

  const getIndex = async () => (indexCache ??= await fetchJson(`${root}/registry.json`))

  return {
    getIndex,
    async search(query) {
      const index = await getIndex()
      return filterComponents(index.items ?? [], query)
    },
    async getItem(name) {
      const index = await getIndex()
      const entry = (index.items ?? []).find((i) => i.name === name)
      const sub = entry ? subdir(entry.type) : 'ui'
      return fetchJson(`${root}/${sub}/${name}.json`)
    },
    async getThemeTokens() {
      return fetchJson(`${root}/themes/base.json`)
    },
  }
}
