import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * AC-2 (J-10) — typography sizes runtime bridge.
 *
 * Tailwind v4 ships a built-in `--text-*` namespace whose values are
 * resolved at BUILD time unless the consumer's stylesheet redeclares them
 * inside `@theme inline { … }`. Without that bridge, the theme generator's
 * `--text-base: 24px` runtime override is silently ignored — components
 * using `text-base` keep the default size.
 *
 * Acceptance: the lib's theme.css MUST expose every `--text-*` size that
 * the theme generator can edit, via `@theme inline`. The 7 sizes today are
 * xs, sm, base, lg, xl, 2xl, 3xl.
 */
describe('AC-2 — Typography sizes flow through @theme inline', () => {
  const themeCss = readFileSync(resolve(__dirname, '..', 'theme.css'), 'utf8')

  const SIZE_KEYS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const

  it.each(SIZE_KEYS)('declares --text-%s: var(--text-%s) inside @theme inline', (key) => {
    // Allow whitespace flexibility — match the literal token names but
    // collapse whitespace before regex.
    const compact = themeCss.replace(/\s+/g, ' ')
    // Match `--text-<key>: var(--text-<key>[, fallback])` — fallback
    // is allowed (recommended for external consumer compat) but the
    // primary bridging declaration must reference the same token name
    // so runtime :root overrides win.
    const pattern = new RegExp(
      `--text-${key.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}\\s*:\\s*var\\(--text-${key.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}(\\s*,[^)]*)?\\)`,
    )
    expect(compact).toMatch(pattern)
  })
})
