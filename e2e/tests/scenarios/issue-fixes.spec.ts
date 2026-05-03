import { test, expect } from '@playwright/test'

test.describe('DensitySwitcher writes data-density + localStorage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  async function selectDensity(
    page: import('@playwright/test').Page,
    name: 'Compatta' | 'Normale' | 'Ampia',
  ) {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('menuitemradio', { name }).click()
  }

  test('clicking Compatta sets compact', async ({ page }) => {
    await selectDensity(page, 'Compatta')
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    const stored = await page.evaluate(() => localStorage.getItem('density'))
    expect(stored).toBe('compact')
  })

  test('clicking Ampia sets comfortable', async ({ page }) => {
    await selectDensity(page, 'Ampia')
    await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable')
    const stored = await page.evaluate(() => localStorage.getItem('density'))
    expect(stored).toBe('comfortable')
  })

  test('selection persists across reloads', async ({ page }) => {
    await selectDensity(page, 'Compatta')
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.getByRole('button', { name: 'Display settings' }).click()
    const item = page.getByRole('menuitemradio', { name: 'Compatta' })
    await expect(item).toHaveAttribute('aria-checked', 'true')
  })
})

test.describe('Docs sidebar active state', () => {
  test('clicking a sidebar link marks it aria-current=page', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.getByRole('link', { name: 'Button', exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/components\/button$/)
    const active = page.locator('a[aria-current="page"]')
    await expect(active).toHaveAttribute('href', '/docs/components/button')
  })

  test('navigating to a different docs route updates the active link', async ({ page }) => {
    await page.goto('/docs/components/button')
    let active = page.locator('a[aria-current="page"]')
    await expect(active).toHaveAttribute('href', '/docs/components/button')
    await page.getByRole('link', { name: 'Introduction', exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/getting-started$/)
    active = page.locator('a[aria-current="page"]')
    await expect(active).toHaveAttribute('href', '/docs/getting-started')
  })
})

test.describe('DisplaySettingsMenu exposes the documented palettes', () => {
  test('default, neon, sunset are listed and legacy names are not', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Display settings' }).click()
    // Scope to the open menu so the assertion targets palette items, not
    // theme/density radio items that share the menu.
    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()
    const labels = await menu.getByRole('menuitemradio').allTextContents()
    const trimmed = labels.map((t) => t.trim())
    expect(trimmed).toEqual(expect.arrayContaining(['Plum+Gold', 'Neon', 'Sunset']))
    expect(trimmed.some((l) => /frost/i.test(l))).toBe(false)
    expect(trimmed.some((l) => /circuit/i.test(l))).toBe(false)
  })
})
