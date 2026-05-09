import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * J-07 Medal tokens — direct-var reference regression guard.
 *
 * The Medal SVG reads `--medal-${rank}-{outer|inner|text}` directly via
 * `var()` — no `@theme inline` bridge needed, because the values are
 * applied as SVG `fill` attributes, not Tailwind utilities. The theme
 * generator's editor writes all 15 vars to `:root`; this test asserts
 * the Medal source still references all 15 so a refactor (e.g. swapping
 * to a 4-color palette per rank, dropping a rank, or hard-coding a
 * default) cannot silently mute the editor.
 *
 * Also asserts the role/aria contract: every medal SVG must declare
 * `role="img"` + `aria-label` for assistive tech.
 */
const medalSource = readFileSync(resolve(__dirname, 'medal.tsx'), 'utf8')

const RANKS = ['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const
const SLOTS = ['outer', 'inner', 'text'] as const

describe('J-07 Medal SVG references --medal-* tokens for every rank × slot', () => {
  it.each(SLOTS)('reads var(--medal-${rank}-%s) via template literal', (slot) => {
    // Match the template form used by Medal: backtick interpolation
    // `var(--medal-${rank}-<slot>)`. We tolerate either spelling style.
    const pattern = new RegExp(`var\\(--medal-\\$\\{rank\\}-${slot}\\)`)
    expect(medalSource).toMatch(pattern)
  })

  it('exposes the canonical 5-rank union', () => {
    // The component's MedalRank type / runtime ranks list is the contract
    // the theme generator's medal editor relies on. Assert every rank
    // appears in source so a future refactor can't silently drop one.
    for (const rank of RANKS) {
      expect(medalSource).toContain(`'${rank}'`)
    }
  })

  it('declares the a11y contract on the SVG (role="img" + aria-label)', () => {
    // Promised in this file's docstring; without these the medal renders
    // as a decorative shape with no announced rank.
    expect(medalSource).toMatch(/role="img"/)
    expect(medalSource).toMatch(/aria-label=/)
  })
})
