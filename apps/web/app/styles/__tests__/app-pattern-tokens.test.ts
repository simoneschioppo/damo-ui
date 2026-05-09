import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * AC-5 (J-08c) — app pattern token propagation regression guard.
 *
 * The Memphis pattern at apps/web/app/styles/patterns.css is consumer-side
 * decoration (the lib does not ship it — see core-knowledge note on
 * patterns being deliberately app-territory). The theme generator's
 * `applyThemeToRoot()` writes --app-pattern-color-{1,2,3} and
 * --app-pattern-size to :root; patterns.css already reads them via var().
 *
 * This test guards against a refactor that silently swaps in literal
 * pixel sizes or hex colors, which would mute the editor without anyone
 * noticing until the playground's pattern surface stops responding to
 * edits.
 */
describe('AC-5 — App pattern stylesheet stays token-driven', () => {
  const css = readFileSync(resolve(__dirname, '..', 'patterns.css'), 'utf8')

  it.each(['1', '2', '3'])('references var(--app-pattern-color-%s) in the gradient stack', (n) => {
    const pattern = new RegExp(`var\\(--app-pattern-color-${n}\\)`)
    expect(css).toMatch(pattern)
  })

  it('drives the pattern repeat with var(--app-pattern-size)', () => {
    expect(css).toMatch(/background-size\s*:[^;]*var\(--app-pattern-size\)/)
  })

  it('preserves :root defaults for the four tokens (so consumer pages without the generator render the pattern)', () => {
    const compact = css.replace(/\s+/g, ' ')
    // Each token gets a default declared on :root before the activator
    // selector (`[data-app-pattern='on']`).
    expect(compact).toMatch(/:root\s*\{[^}]*--app-pattern-color-1\s*:/)
    expect(compact).toMatch(/:root\s*\{[^}]*--app-pattern-color-2\s*:/)
    expect(compact).toMatch(/:root\s*\{[^}]*--app-pattern-color-3\s*:/)
    expect(compact).toMatch(/:root\s*\{[^}]*--app-pattern-size\s*:/)
  })
})
