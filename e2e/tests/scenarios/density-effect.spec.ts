import { test, expect, type Page } from '@playwright/test'

/**
 * Density switching must actually resize interactive controls, not just flip
 * an attribute. Measures a real button's computed padding at each density on
 * the Button docs page (which renders many <Button> instances).
 *
 * Density now lives in the docs-site cog popover: open the topbar's "Display
 * settings" trigger, then click the density segmented button (Compact /
 * Normal / Comfortable). The default locale is English; the tests use the
 * EN labels.
 */
test.describe('Density picker affects rendered spacing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/components/button')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  async function measureButtonPadTop(page: Page) {
    return page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>(
        'main button.bg-primary, main button.bg-secondary',
      )
      if (!btn) throw new Error('no docs Button found inside <main>')
      return parseFloat(getComputedStyle(btn).paddingTop)
    })
  }

  async function selectDensity(page: Page, name: 'Compact' | 'Normal' | 'Comfortable') {
    await page.getByRole('button', { name: 'Display settings' }).click()
    // Density AttrToggleGroup uses segmented buttons inside the popover.
    await page.getByRole('button', { name }).click()
    const expected =
      name === 'Compact' ? 'compact' : name === 'Comfortable' ? 'comfortable' : 'normal'
    await expect(page.locator('html')).toHaveAttribute('data-density', expected)
    // Close the popover so it doesn't overlap the measurement target.
    await page.keyboard.press('Escape')
  }

  test('compact shrinks button padding vs normal', async ({ page }) => {
    const pNormal = await measureButtonPadTop(page)
    await selectDensity(page, 'Compact')
    const pCompact = await measureButtonPadTop(page)
    expect(pCompact).toBeLessThan(pNormal)
  })

  test('comfortable grows button padding vs normal', async ({ page }) => {
    const pNormal = await measureButtonPadTop(page)
    await selectDensity(page, 'Comfortable')
    const pComfortable = await measureButtonPadTop(page)
    expect(pComfortable).toBeGreaterThan(pNormal)
  })

  test('--density-scale-y actually flows into a rendered element', async ({ page }) => {
    await selectDensity(page, 'Compact')
    const scale = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--density-scale-y')),
    )
    expect(scale).toBeCloseTo(0.75, 2)
  })
})
