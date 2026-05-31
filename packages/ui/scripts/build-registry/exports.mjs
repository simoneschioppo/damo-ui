/**
 * Parse the library's public barrel (`src/index.ts`) into a
 * symbol → registry-item map, so the migration codemod (#86) can answer
 * "which component does `DialogContent` come from?" from the registry alone
 * (the consumer doesn't have the monorepo source).
 *
 * Pure parsing helpers — the orchestrator in build.mjs supplies file contents.
 */

/**
 * Extract re-export statements from a barrel file.
 * Returns named re-exports (`export { A, type B } from './x'`) and
 * star re-exports (`export * from './icons'`), each with its source path.
 *
 * @param {string} source
 * @returns {{ names: string[], from: string, star: boolean }[]}
 */
export function parseExports(source) {
  const out = []

  // Named re-exports — `{ ... }` may span multiple lines.
  const named = /export\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g
  let m
  while ((m = named.exec(source)) !== null) {
    const names = m[1]
      .split(',')
      .map((s) => exportedName(s))
      .filter(Boolean)
    out.push({ names, from: m[2], star: false })
  }

  // Star re-exports — `export * from './icons'`.
  const star = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g
  while ((m = star.exec(source)) !== null) {
    out.push({ names: [], from: m[1], star: true })
  }

  return out
}

/**
 * Normalise one export-clause token to the *exported* identifier:
 * strips a leading `type `, resolves `X as Y` to `Y`, drops empties.
 *
 * @param {string} token
 * @returns {string}
 */
export function exportedName(token) {
  let t = token.trim().replace(/^type\s+/, '')
  if (!t) return ''
  const asMatch = t.match(/\bas\s+([A-Za-z_$][\w$]*)\s*$/)
  if (asMatch) return asMatch[1]
  return /^[A-Za-z_$][\w$]*$/.test(t) ? t : ''
}

/**
 * Map a barrel re-export path to the registry-item name it belongs to.
 * `./components/dialog` → `dialog`; `./lib/cn` → `cn`; `./icons` → `icons`.
 *
 * @param {string} from
 * @returns {string | null}
 */
export function itemNameForPath(from) {
  const m = from.match(/^\.\/(components|lib|hooks|icons)(?:\/(.+))?$/)
  if (!m) return null
  const [, group, rest] = m
  if (group === 'icons') return 'icons'
  if (!rest) return null
  return rest.split('/')[0]
}
