import { test, expect } from '@playwright/test'

/**
 * Density switcher must actually resize interactive controls, not just flip
 * an attribute. Measures a real button's computed padding at each density on
 * the Button docs page (which renders many <Button> instances).
 */
test.describe('Density switcher affects rendered spacing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/components/button')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  async function measureButtonPadTop(page: import('@playwright/test').Page) {
    return page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>(
        'main button.bg-primary, main button.bg-secondary',
      )
      if (!btn) throw new Error('no docs Button found inside <main>')
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
