import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** Files that are part of the dev/test tooling, never shipped to consumers. */
const EXCLUDED = /\.(test|stories)\.[tj]sx?$/

/**
 * Recursively list every file under `dir`, returned as paths relative to it.
 *
 * @param {string} dir
 * @returns {string[]} relative file paths (POSIX separators)
 */
export function walkFiles(dir) {
  /** @type {string[]} */
  const out = []
  const recurse = (current) => {
    for (const entry of readdirSync(current)) {
      const abs = join(current, entry)
      if (statSync(abs).isDirectory()) {
        recurse(abs)
      } else {
        out.push(relative(dir, abs).split(/[\\/]/).join('/'))
      }
    }
  }
  recurse(dir)
  return out.sort()
}

/**
 * Shippable source files for a component/lib folder: `.ts`/`.tsx` that are
 * not test or story files.
 *
 * @param {string} dir
 * @returns {string[]}
 */
export function sourceFiles(dir) {
  return walkFiles(dir).filter((f) => /\.[tj]sx?$/.test(f) && !EXCLUDED.test(f))
}

/**
 * Read a UTF-8 file.
 * @param {string} path
 * @returns {string}
 */
export function readText(path) {
  return readFileSync(path, 'utf8')
}
