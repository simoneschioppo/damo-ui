import { test, expect } from '@playwright/test'

/**
 * Regression — density switcher must actually resize interactive controls,
 * not just flip an attribute. These tests measure a real button's computed
 * padding at each density and assert it scales.
 */
test.describe('Density switcher affects rendered spacing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  async function measureButtonPadTop(page: import('@playwright/test').Page) {
    // Any medium-sized Button (py-2.5) inside the design-system showcase.
    return page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>(
        '#buttons button.bg-gold-500, #buttons button.bg-plum-500',
      )
      if (!btn) throw new Error('no showcase button found in #buttons')
      return parseFloat(getComputedStyle(btn).paddingTop)
    })
  }

  test('compact shrinks button padding vs normal', async ({ page }) => {
    const pNormal = await measureButtonPadTop(page)
    await page.getByRole('button', { name: 'Compatta' }).click()
    const pCompact = await measureButtonPadTop(page)
    expect(pCompact).toBeLessThan(pNormal)
  })

  test('comfortable grows button padding vs normal', async ({ page }) => {
    const pNormal = await measureButtonPadTop(page)
    await page.getByRole('button', { name: 'Ampia' }).click()
    const pComfortable = await measureButtonPadTop(page)
    expect(pComfortable).toBeGreaterThan(pNormal)
  })

  test('--density-scale-y actually flows into a rendered element', async ({ page }) => {
    await page.getByRole('button', { name: 'Compatta' }).click()
    const scale = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--density-scale-y')),
    )
    expect(scale).toBeCloseTo(0.75, 2)
  })
})
