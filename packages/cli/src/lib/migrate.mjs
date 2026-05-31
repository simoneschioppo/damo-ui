/**
 * Pure helpers for the `migrate-from-npm` codemod: map imported symbols to
 * their component, and compute the module specifier each rewritten import
 * should point at. No ts-morph / fs here so they unit-test cleanly.
 *
 * @typedef {{ name: string, alias?: string, isTypeOnly?: boolean }} ImportSpec
 */
import { posix as P } from 'node:path'

/**
 * Group import specifiers by the registry component that owns each symbol,
 * collecting any symbol the registry doesn't know about.
 *
 * @param {ImportSpec[]} specs
 * @param {Record<string,string>} exportMap symbol -> component
 * @returns {{ groups: Map<string, ImportSpec[]>, unmapped: string[] }}
 */
export function groupSpecsByComponent(specs, exportMap) {
  const groups = new Map()
  const unmapped = []
  for (const spec of specs) {
    const component = exportMap[spec.name]
    if (!component) {
      unmapped.push(spec.name)
      continue
    }
    if (!groups.has(component)) groups.set(component, [])
    groups.get(component).push(spec)
  }
  return { groups, unmapped }
}

/**
 * The aliased module specifier for a component import, e.g.
 * `@/components/ui/button`. Honours a custom `aliases.ui`.
 *
 * @param {string} component
 * @param {Record<string,string>} [aliases]
 * @returns {string}
 */
export function componentImportPath(component, aliases = {}) {
  const ui = (aliases.ui ?? '@/components/ui').replace(/\/+$/, '')
  return `${ui}/${component}`
}

/**
 * Relative-import fallback for projects with no `@/` path alias configured.
 * Computes the specifier from the importing file to the component folder.
 *
 * @param {string} fromFileRel importing file, relative to project root (POSIX)
 * @param {string} component
 * @param {string} [srcRoot] '' or 'src'
 * @returns {string}
 */
export function relativeImportPath(fromFileRel, component, srcRoot = '') {
  const target = P.join(srcRoot, 'components/ui', component)
  let rel = P.relative(P.dirname(fromFileRel), target)
  if (!rel.startsWith('.')) rel = `./${rel}`
  return rel
}
