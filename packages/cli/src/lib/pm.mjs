/** Detect and drive the consumer's package manager for installing npm deps. */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

/**
 * Detect the package manager from lockfiles, falling back to npm.
 * @param {string} cwd
 * @returns {'pnpm'|'yarn'|'bun'|'npm'}
 */
export function detectPackageManager(cwd) {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun'
  return 'npm'
}

/** Build the install argv for a package manager + dependency list. */
export function installArgs(pm, deps) {
  if (pm === 'yarn') return ['add', ...deps]
  if (pm === 'bun') return ['add', ...deps]
  return ['install', ...deps] // npm + pnpm
}

/**
 * Install dependencies in `cwd`. Returns the spawn result so callers can
 * surface failures without throwing.
 *
 * @param {string[]} deps
 * @param {string} cwd
 * @param {string} [pm]
 */
export function installDeps(deps, cwd, pm = detectPackageManager(cwd)) {
  if (!deps.length) return { status: 0, pm }
  const result = spawnSync(pm, installArgs(pm, deps), { cwd, stdio: 'inherit' })
  return { status: result.status ?? 1, pm }
}
