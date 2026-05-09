import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * AC-1 (J-13a) — source-contract guard for the prefers-reduced-motion override.
 *
 * The playground app ships a global a11y rule that forces every transition to
 * 0.01ms when the user prefers reduced motion:
 *
 *     @media (prefers-reduced-motion: reduce) {
 *       *, *::before, *::after { transition-duration: 0.01ms !important; ... }
 *     }
 *
 * Combined with `!important` and the universal `*` selector, this rule
 * **always wins** against the lib's `@utility duration-*` blocks (which read
 * `var(--duration-*)`) — so editing motion durations in the theme generator
 * appears to do nothing. The reported defect.
 *
 * Acceptance for the fix:
 *   - The reduced-motion rule must remain in the file (a11y baseline).
 *   - It must be SCOPED so the `/theme-generator` editor can opt out while
 *     the user is actively previewing motion. Recommended pattern:
 *
 *       html:not([data-motion-preview]) *,
 *       html:not([data-motion-preview]) *::before,
 *       html:not([data-motion-preview]) *::after { … }
 *
 *     The theme-generator page sets `<html data-motion-preview>` while it is
 *     the active route, so the a11y override stays in effect everywhere
 *     else.
 *
 * This source-contract test is the cheap red-phase: a Playwright spec
 * (`e2e/tests/scenarios/theme-generator-motion-propagation.spec.ts`) is the
 * full runtime regression guard.
 */
describe('AC-1 — reduced-motion override is scoped (source contract)', () => {
  const themeCss = readFileSync(resolve(__dirname, '..', 'theme.css'), 'utf8')

  it('still ships a prefers-reduced-motion rule (a11y baseline preserved)', () => {
    expect(themeCss).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  })

  it('does NOT ship an unscoped universal *, *::before, *::after override', () => {
    // Strip whitespace before matching the selector so the regex stays
    // resilient to formatting. The universal-only form is the bug shape.
    const compact = themeCss.replace(/\s+/g, ' ')
    // Look for `*, *::before, *::after {` immediately preceded by either the
    // media's opening brace or an a11y-only selector with no scope. If found,
    // the override is global and overrides every motion utility.
    const unscopedUniversal =
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\*\s*,\s*\*::before\s*,\s*\*::after\s*\{/
    expect(compact).not.toMatch(unscopedUniversal)
  })

  it('scopes the universal selector behind a [data-motion-preview]-aware guard', () => {
    // Whichever scoping mechanism is chosen (class-based, attribute-based on
    // <html>, scoped to a parent landmark, etc.), the universal `*` MUST be
    // gated by SOME condition. The minimal contract is: any `*` selector
    // inside the media query must come after a parent with `:not(...)`,
    // `[data-...]`, `.class`, or `body > .x` style scope.
    const mediaBlockMatch = themeCss.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)^\}/m,
    )
    expect(mediaBlockMatch, 'media block must be present').toBeTruthy()
    const block = mediaBlockMatch![1]!

    // Forbidden: a top-level `*` selector unsupported by any scope.
    // Permitted: `html[data-X] *`, `html:not([data-X]) *`, `.scope *`, etc.
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    const hasUnscopedStar = lines.some(
      (line) => /^\*\s*[,{]/.test(line) || /^\*::before\s*[,{]/.test(line),
    )
    expect(
      hasUnscopedStar,
      'the * selector inside the reduced-motion block must be scoped (e.g. `html:not([data-motion-preview]) *`)',
    ).toBe(false)
  })
})
