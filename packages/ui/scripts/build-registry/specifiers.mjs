/**
 * Pure helpers for parsing and rewriting ES import specifiers.
 *
 * The registry generator copies source verbatim into a consumer's project, so
 * every workspace-relative import must be rewritten to the path-alias form a
 * shadcn-style consumer expects (`@/lib/cn`, `@/components/ui/card`, …).
 *
 * Classification is *path-aware*: a relative specifier is resolved against the
 * importing file's location within `src/` before being categorised, because
 * the same text means different things at different depths (a component does
 * `../../lib/cn`, a hook does `../lib/cn`). Resolution maps onto the four
 * registry namespaces — components, lib, hooks, icons.
 *
 * These functions are side-effect free so they can be unit-tested in isolation.
 *
 * @typedef {(
 *   | { kind: 'react' }
 *   | { kind: 'npm', pkg: string }
 *   | { kind: 'same' }
 *   | { kind: 'component', name: string, rewrite: string }
 *   | { kind: 'lib', name: string, rewrite: string }
 *   | { kind: 'hook', name: string, rewrite: string }
 *   | { kind: 'icons', rewrite: string }
 *   | { kind: 'unknown', spec: string }
 * )} Classification
 */
import { posix as P } from 'node:path'

const FROM_RE = /(?:import|export)\b[\s\S]*?\bfrom\s*['"]([^'"]+)['"]/g
const SIDE_EFFECT_RE = /\bimport\s+['"]([^'"]+)['"]/g

/**
 * Extract the unique set of module specifiers referenced by a source file.
 * Covers static imports, re-exports and side-effect imports.
 *
 * @param {string} source
 * @returns {string[]}
 */
export function extractImports(source) {
  const found = new Set()
  for (const re of [FROM_RE, SIDE_EFFECT_RE]) {
    re.lastIndex = 0
    let match
    while ((match = re.exec(source)) !== null) found.add(match[1])
  }
  return [...found]
}

/**
 * Resolve the installable npm package name from an import specifier.
 * @param {string} spec
 * @returns {string}
 */
export function npmPackageName(spec) {
  if (spec.startsWith('@')) return spec.split('/').slice(0, 2).join('/')
  return spec.split('/')[0]
}

/**
 * The registry-item key that owns a given `src/`-relative path. Items are
 * keyed by their first two path segments, so every file inside a component or
 * lib folder maps back to the same item.
 *
 * @param {string} srcPath e.g. `components/button`, `lib/i18n/dictionaries`
 * @returns {string | null}
 */
export function itemKey(srcPath) {
  const [a, b] = srcPath.split('/')
  if (a === 'components') return `component:${b}`
  if (a === 'icons') return 'icons'
  if (a === 'lib') return `lib:${b}`
  if (a === 'hooks') return `hook:${b}`
  return null
}

/** Categorise a resolved `src/`-relative path into its cross-item classification. */
function classifyResolved(resolved) {
  const seg = resolved.split('/')
  if (seg[0] === 'components') {
    const name = seg[1]
    const rest = seg.slice(2).join('/')
    return {
      kind: 'component',
      name,
      rewrite: rest ? `@/components/ui/${name}/${rest}` : `@/components/ui/${name}`,
    }
  }
  if (seg[0] === 'icons') {
    const rest = seg.slice(1).join('/')
    return {
      kind: 'icons',
      rewrite: rest ? `@/components/ui/icons/${rest}` : '@/components/ui/icons',
    }
  }
  if (seg[0] === 'lib') {
    const rest = seg.slice(1).join('/')
    return { kind: 'lib', name: seg[1], rewrite: `@/lib/${rest}` }
  }
  if (seg[0] === 'hooks') {
    const rest = seg.slice(1).join('/')
    return { kind: 'hook', name: seg[1], rewrite: `@/hooks/${rest}` }
  }
  return { kind: 'unknown', spec: resolved }
}

/**
 * Classify a single import specifier from a file at `fromDir`, owned by the
 * registry item `ownerKey`. References that resolve back to the owning item
 * are `same` (shipped together, left untouched).
 *
 * @param {string} spec
 * @param {string} fromDir `src/`-relative directory of the importing file
 * @param {string | null} ownerKey item key of the importing file
 * @returns {Classification}
 */
export function classifySpecifier(spec, fromDir, ownerKey) {
  if (spec === 'react' || spec.startsWith('react/')) return { kind: 'react' }
  if (spec === 'react-dom' || spec.startsWith('react-dom/')) return { kind: 'react' }
  if (!spec.startsWith('.')) return { kind: 'npm', pkg: npmPackageName(spec) }

  const resolved = P.normalize(P.join(fromDir, spec))
  if (itemKey(resolved) === ownerKey) return { kind: 'same' }
  return classifyResolved(resolved)
}

/**
 * Rewrite every cross-item workspace import in a source file to its
 * copy-paste-friendly path-alias form. Quote-wrapped exact replacement avoids
 * rewriting a specifier that is a prefix of another.
 *
 * @param {string} source
 * @param {string} fromDir
 * @param {string | null} ownerKey
 * @returns {string}
 */
export function rewriteSource(source, fromDir, ownerKey) {
  let out = source
  for (const spec of extractImports(source)) {
    const c = classifySpecifier(spec, fromDir, ownerKey)
    if ('rewrite' in c && c.rewrite && c.rewrite !== spec) {
      out = out.split(`'${spec}'`).join(`'${c.rewrite}'`)
      out = out.split(`"${spec}"`).join(`"${c.rewrite}"`)
    }
  }
  return out
}
