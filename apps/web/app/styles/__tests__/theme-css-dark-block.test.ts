import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * gh-91 — Plum+Gold dark mode refinement.
 *
 * Source-contract guard for the dark block in `apps/web/app/styles/theme.css`.
 * `getComputedStyle` won't help here (jsdom doesn't apply external CSS), so
 * we read the file and assert the post-refinement declarations are present.
 *
 * The runtime check lives in
 * `e2e/tests/scenarios/dark-theme-tokens.spec.ts`.
 *
 * See `_bmad-output/implementation-artifacts/spec-gh-91-plum-gold-dark-refinement.md`.
 */

const css = readFileSync(resolve(__dirname, '..', 'theme.css'), 'utf8')

/**
 * Extract the body of a `:root[data-theme='dark'] { … }` block.
 * Returns the substring between the opening `{` and its matching `}`.
 *
 * Single-match assumption: `String.match` returns the FIRST opener found.
 * `theme.css` today has exactly one `:root[data-theme='dark']` block.
 * If a future task adds palette-scoped dark overrides
 * (e.g. `:root[data-palette='neon'][data-theme='dark']`), this helper
 * will read only the first and silently miss the others — extend it
 * (e.g. `matchAll`) before that day arrives. See gh-91 review HIGH-2.
 */
function extractDarkBlock(source: string): string {
  const match = source.match(/:root\[data-theme=['"]dark['"]\]\s*\{/)
  if (!match) throw new Error("dark block opening not found in theme.css")
  const start = match.index! + match[0].length
  let depth = 1
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) return source.slice(start, i)
    }
  }
  throw new Error("dark block closing brace not found in theme.css")
}

describe('theme.css — dark block (gh-91)', () => {
  const darkBody = extractDarkBlock(css).replace(/\s+/g, ' ')

  describe('semantic deltas', () => {
    it('--muted reads from --ink-800 (was --ink-700)', () => {
      expect(darkBody).toMatch(/--muted\s*:\s*var\(--ink-800\)/)
    })

    it('--muted-foreground reads from --paper-50 (full-white text on muted)', () => {
      expect(darkBody).toMatch(/--muted-foreground\s*:\s*var\(--paper-50\)/)
    })

    it('--primary reads from --brand-400 (was --brand-500)', () => {
      expect(darkBody).toMatch(/--primary\s*:\s*var\(--brand-400\)/)
    })

    it('--ring reads from --brand-400 (follows primary)', () => {
      expect(darkBody).toMatch(/--ring\s*:\s*var\(--brand-400\)/)
    })

    it('--badge-featured reads from --brand-400 (follows primary)', () => {
      expect(darkBody).toMatch(/--badge-featured\s*:\s*var\(--brand-400\)/)
    })

    it('--warning is the custom amber #e8a435 (decoupled from primary)', () => {
      expect(darkBody).toMatch(/--warning\s*:\s*#e8a435/i)
    })

    it('does NOT redeclare --warning as var(--brand-500)', () => {
      expect(darkBody).not.toMatch(/--warning\s*:\s*var\(--brand-500\)/)
    })

    it('--memphis-border-color is light gray #cccccc (visible frame on dark plum)', () => {
      expect(darkBody).toMatch(/--memphis-border-color\s*:\s*#cccccc/i)
    })
  })

  describe('chart overrides (was inheriting light values)', () => {
    it('--chart-1 reads from --ink-300', () => {
      expect(darkBody).toMatch(/--chart-1\s*:\s*var\(--ink-300\)/)
    })

    it('--chart-2 reads from --brand-400', () => {
      expect(darkBody).toMatch(/--chart-2\s*:\s*var\(--brand-400\)/)
    })

    it('--chart-3 is dark-success #6fa85c', () => {
      expect(darkBody).toMatch(/--chart-3\s*:\s*#6fa85c/i)
    })

    it('--chart-4 is dark-destructive #c94a2f', () => {
      expect(darkBody).toMatch(/--chart-4\s*:\s*#c94a2f/i)
    })

    it('--chart-5 reads from --ink-100', () => {
      expect(darkBody).toMatch(/--chart-5\s*:\s*var\(--ink-100\)/)
    })
  })

  describe('medal outer overrides (no longer match dark background)', () => {
    it('--medal-gold-outer reads from --paper-50 (was inheriting --ink-900 = bg)', () => {
      expect(darkBody).toMatch(/--medal-gold-outer\s*:\s*var\(--paper-50\)/)
    })

    it('--medal-master-outer reads from --paper-50 (was inheriting --ink-900 = bg)', () => {
      expect(darkBody).toMatch(/--medal-master-outer\s*:\s*var\(--paper-50\)/)
    })
  })
})
