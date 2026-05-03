import { test, expect, type Page } from '@playwright/test'

/**
 * Density switcher must actually resize interactive controls, not just flip
 * an attribute. Measures a real button's computed padding at each density on
 * the Button docs page (which renders many <Button> instances).
 *
 * Density is now driven through DisplaySettingsMenu: open the topbar's cog
 * trigger, then click the relevant menuitemradio. The trigger lives in the
 * sticky header and is reachable on every public page.
 */
test.describe('Density switcher affects rendered spacing', () => {
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

  async function selectDensity(page: Page, name: 'Compatta' | 'Normale' | 'Ampia') {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('menuitemradio', { name }).click()
    // After click the menu auto-closes — wait until data-density is mutated
    // before measuring layout to avoid catching in-flight transitions.
    const expected = name === 'Compatta' ? 'compact' : name === 'Ampia' ? 'comfortable' : 'normal'
    await expect(page.locator('html')).toHaveAttribute('data-density', expected)
  }

  test('compact shrinks button padding vs normal', async ({ page }) => {
    const pNormal = await measureButtonPadTop(page)
    await selectDensity(page, 'Compatta')
    const pCompact = await measureButtonPadTop(page)
    expect(pCompact).toBeLessThan(pNormal)
  })

  test('comfortable grows button padding vs normal', async ({ page }) => {
    const pNormal = await measureButtonPadTop(page)
    await selectDensity(page, 'Ampia')
    const pComfortable = await measureButtonPadTop(page)
    expect(pComfortable).toBeGreaterThan(pNormal)
  })

  test('--density-scale-y actually flows into a rendered element', async ({ page }) => {
    await selectDensity(page, 'Compatta')
    const scale = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--density-scale-y')),
    )
    expect(scale).toBeCloseTo(0.75, 2)
  })
})
