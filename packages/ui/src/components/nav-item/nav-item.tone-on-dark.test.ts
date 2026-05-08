import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * AC-3 (J-08b) — NavItem `onDark` active gradient is token-driven.
 *
 * The previous implementation hard-coded gold/plum rgba literals in the
 * onDark variant's `aria-[current=page]:bg-[linear-gradient(...)]` class
 * — token edits in the theme generator's "Nav on dark" controls were
 * partially ignored (only foreground/border-color responded; the
 * gradient stayed gold/plum no matter what).
 *
 * Acceptance: the variant must derive the gradient from
 * --nav-on-dark-accent and --nav-on-dark-accent-strong via color-mix,
 * mirroring the same recipe Chip / Toast / Hint use for tinted surfaces.
 */
describe('AC-3 — NavItem onDark gradient reads --nav-on-dark-* tokens', () => {
  // Post gh-61 refactor: the gradient literal lives in the shared
  // `selection-chrome.ts` helper. The variants file invokes the helper with
  // the `--nav-on-dark-*` tokens as arguments. Both files must remain free
  // of the legacy gold/plum rgba literals AND must keep the token names +
  // color-mix recipe wired through, so we assert against the union.
  const variantsCss = readFileSync(resolve(__dirname, 'nav-item.variants.ts'), 'utf8')
  const chromeHelperSrc = readFileSync(resolve(__dirname, '../../lib/selection-chrome.ts'), 'utf8')

  it('the variants file does not embed the legacy gold rgba literal `rgba(213,168,69,…)`', () => {
    expect(variantsCss).not.toMatch(/rgba\(\s*213\s*,\s*168\s*,\s*69/)
  })

  it('the chrome helper does not embed the legacy gold rgba literal `rgba(213,168,69,…)`', () => {
    expect(chromeHelperSrc).not.toMatch(/rgba\(\s*213\s*,\s*168\s*,\s*69/)
  })

  it('the variants file does not embed the legacy plum rgba literal `rgba(122,57,128,…)`', () => {
    expect(variantsCss).not.toMatch(/rgba\(\s*122\s*,\s*57\s*,\s*128/)
  })

  it('the chrome helper does not embed the legacy plum rgba literal `rgba(122,57,128,…)`', () => {
    expect(chromeHelperSrc).not.toMatch(/rgba\(\s*122\s*,\s*57\s*,\s*128/)
  })

  it('the onDark active gradient references --nav-on-dark-accent', () => {
    // The variants file passes the tokens as arguments to the chrome helper.
    expect(variantsCss).toMatch(/var\(--nav-on-dark-accent\)/)
    expect(variantsCss).toMatch(/var\(--nav-on-dark-accent-strong\)/)
  })

  it('the onDark active gradient uses color-mix() to soften the tokens', () => {
    // The tinting recipe (oklab color-mix) lives in the shared helper.
    // In Tailwind arbitrary values, spaces become underscores; accept both.
    expect(chromeHelperSrc).toMatch(/color-mix\(\s*in[\s_]+oklab/)
  })
})
