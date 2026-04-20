import { test, expect } from '@playwright/test'

/**
 * Smoke spec for the refactored Design System page.
 *
 * Guards against regressions in the lib-first DS rewrite by verifying:
 *   - the /design-system route renders
 *   - the DAMACCHI brand block in the sidebar TOC is mounted
 *   - all 11 sections are anchor-reachable via their #id
 *   - buttons section (#buttons) has at least 3 rendered/visible buttons
 *   - patterns section (#patterns) exposes ≥ 6 pattern swatches (falls back to
 *     matching the header eyebrow text `STRIPES`, `DOTS`, `GRID`, etc.)
 *   - figma section (#figma) renders exactly 3 Hint cards (3 <h4>s)
 */

const SECTION_IDS = [
  'colors',
  'type',
  'buttons',
  'cards',
  'inputs',
  'badges',
  'icons',
  'avatars',
  'mascot',
  'patterns',
  'figma',
] as const

const PATTERN_HEADERS = [
  'STRIPES 45°',
  'STRIPES H',
  'DOTS',
  'GRID',
  'CHECKER',
  'WEAVE',
  'WAVES',
  'SCATTER',
] as const

test.describe('Design System — lib-first refactor smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system')
  })

  test('page loads at /design-system', async ({ page }) => {
    await expect(page).toHaveURL(/\/design-system$/)
  })

  test('sidebar shows DAMACCHI brand block', async ({ page }) => {
    await expect(page.getByText('DAMACCHI', { exact: true }).first()).toBeVisible()
  })

  test('all 11 sections are anchor-reachable (#colors → #figma)', async ({ page }) => {
    for (const id of SECTION_IDS) {
      const section = page.locator(`section#${id}`)
      await expect(section).toHaveCount(1)
      await expect(section).toBeAttached()
    }
  })

  test('section 03 Buttons shows at least 3 visible buttons', async ({ page }) => {
    const buttons = page.locator('section#buttons button:visible')
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('section 10 Patterns has at least 6 pattern swatches', async ({ page }) => {
    const patternsSection = page.locator('section#patterns')

    // Preferred locator: an explicit data attribute on pattern wrappers. The
    // current PatternSwatch component does not emit it, so we fall through to
    // the header-based fallback described in the spec requirements.
    const taggedSwatches = patternsSection.locator('[data-pattern-swatch]')
    const taggedCount = await taggedSwatches.count()

    if (taggedCount >= 6) {
      expect(taggedCount).toBeGreaterThanOrEqual(6)
      return
    }

    // Fallback: count distinct swatch header labels (STRIPES, DOTS, GRID, ...).
    let matched = 0
    for (const name of PATTERN_HEADERS) {
      const header = patternsSection.getByText(name, { exact: true })
      if ((await header.count()) > 0) matched += 1
    }
    expect(matched).toBeGreaterThanOrEqual(6)
  })

  test('section 11 Figma renders 3 Hint cards with titles', async ({ page }) => {
    const hintTitles = page.locator('section#figma h4')
    await expect(hintTitles).toHaveCount(3)
    await expect(hintTitles.first()).toBeVisible()
  })
})
