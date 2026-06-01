import { test, expect } from '@playwright/test'

// Below `lg` the 340px editor collapses into a drawer and the preview goes
// full-width. Self-contained viewports (no global mobile project needed).
const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 900 }
const TOGGLE = /toggle navigation|navigazione/i

test.describe('Theme generator — mobile editor drawer (< lg)', () => {
  test.use({ viewport: MOBILE })

  test('hides the inline editor and shows the open-editor trigger', async ({ page }) => {
    await page.goto('/theme-generator')
    await expect(page.locator('aside')).toBeHidden()
    await expect(page.getByRole('button', { name: TOGGLE })).toBeVisible()
  })

  test('opens the editor inside a drawer', async ({ page }) => {
    await page.goto('/theme-generator')
    await page.getByRole('button', { name: TOGGLE }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // The Palette/Theme/Identity editor tabs live inside the drawer.
    await expect(dialog.getByRole('tab', { name: 'Palette' })).toBeVisible()
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/theme-generator')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('Theme generator — desktop (>= lg)', () => {
  test.use({ viewport: DESKTOP })

  test('shows the inline editor sidebar and hides the trigger', async ({ page }) => {
    await page.goto('/theme-generator')
    await expect(page.locator('aside').first()).toBeVisible()
    await expect(page.getByRole('button', { name: TOGGLE })).toBeHidden()
  })
})
