import { test, expect } from '@playwright/test'

/**
 * E2E coverage for the DisplaySettingsMenu in the topbar of the web app.
 *
 * Verifies trigger visibility, menu opening, radio-group selection,
 * persistence across reload, palette sanitization on unknown localStorage
 * values, and keyboard ergonomics.
 */
test.describe('DisplaySettingsMenu (topbar)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  test('trigger is visible on the home page', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Display settings' })).toBeVisible()
  })

  test('opens the menu and shows three labelled groups', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await expect(page.getByRole('menu')).toBeVisible()
    // menu auto-closes on selection but is open until then; just assert items exist
    const items = page.getByRole('menuitemradio')
    // 2 theme + 3 palette + 3 density = 8
    await expect(items).toHaveCount(8)
  })

  test('selecting Dark sets data-theme and persists', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('menuitemradio', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const persisted = await page.evaluate(() => window.localStorage.getItem('theme'))
    expect(persisted).toBe('dark')
  })

  test('persists across reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('menuitemradio', { name: 'Compatta' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
  })

  test('sanitizes an unknown persisted palette to the default', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('palette', 'totally-unknown-palette')
    })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'default')
    const persisted = await page.evaluate(() => window.localStorage.getItem('palette'))
    expect(persisted).toBe('default')
  })

  test('trigger size stays constant across global density changes', async ({ page }) => {
    // The trigger pins itself to data-density="compact" on its wrapper, so
    // the cog button must keep the same dimensions even when the user picks
    // "Ampia" or "Normale" globally.
    const triggerLocator = page.getByRole('button', { name: 'Display settings' })

    async function size() {
      const box = await triggerLocator.boundingBox()
      if (!box) throw new Error('trigger has no bounding box')
      return { w: Math.round(box.width), h: Math.round(box.height) }
    }

    const compact = await size()

    // Switch to "Ampia" via the menu and re-measure.
    await triggerLocator.click()
    await page.getByRole('menuitemradio', { name: 'Ampia' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable')
    const onComfortable = await size()
    expect(onComfortable).toEqual(compact)

    // Switch back to "Normale".
    await triggerLocator.click()
    await page.getByRole('menuitemradio', { name: 'Normale' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'normal')
    const onNormal = await size()
    expect(onNormal).toEqual(compact)
  })

  test('opens via keyboard from a focused trigger and supports keyboard selection', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Display settings' })
    await trigger.focus()
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('menu')).toBeVisible()
    // Keyboard-select the "Dark" item (Radix moves typed-letter focus inside
    // the open menu — works the same for cursor-less screen-reader users).
    const darkItem = page.getByRole('menuitemradio', { name: 'Dark' })
    await darkItem.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
