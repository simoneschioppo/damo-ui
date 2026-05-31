/**
 * Map a registry file's `target` (always alias-relative, e.g.
 * `components/ui/button/button.tsx`, `lib/cn.ts`, `hooks/use-x.ts`,
 * `styles/tokens.css`) onto a concrete path inside the consumer project,
 * honouring their `components.json` aliases and `src/` layout.
 *
 * Pure functions — no filesystem access — so they are unit-testable.
 */
import { posix as P } from 'node:path'

/**
 * Strip a leading `@/` (or `~/`) alias prefix, returning the project-relative
 * remainder. `@/components/ui` -> `components/ui`.
 */
export function stripAlias(alias) {
  return alias.replace(/^[@~]\//, '').replace(/^\/+/, '')
}

/**
 * Resolve a registry `target` to a project-relative path.
 *
 * The target's first segment selects the alias:
 *   components/ui/* -> aliases.ui
 *   components/*     -> aliases.components
 *   lib/*            -> aliases.lib   (utils file -> aliases.utils)
 *   hooks/*          -> aliases.hooks
 *   anything else    -> kept under srcRoot as-is (e.g. styles/*)
 *
 * @param {string} target alias-relative target path
 * @param {object} opts
 * @param {Record<string,string>} opts.aliases components.json aliases
 * @param {string} [opts.srcRoot] '' or 'src' — where `@/` points
 * @returns {string} project-relative path (POSIX separators)
 */
export function targetToProjectPath(target, { aliases = {}, srcRoot = '' } = {}) {
  const seg = target.split('/')
  let rel

  if (seg[0] === 'components' && seg[1] === 'ui') {
    rel = P.join(stripAlias(aliases.ui ?? 'components/ui'), seg.slice(2).join('/'))
  } else if (seg[0] === 'components') {
    rel = P.join(stripAlias(aliases.components ?? 'components'), seg.slice(1).join('/'))
  } else if (seg[0] === 'hooks') {
    rel = P.join(stripAlias(aliases.hooks ?? 'hooks'), seg.slice(1).join('/'))
  } else if (seg[0] === 'lib') {
    rel = P.join(stripAlias(aliases.lib ?? 'lib'), seg.slice(1).join('/'))
  } else {
    rel = target
  }

  return srcRoot ? P.join(srcRoot, rel) : rel
}
