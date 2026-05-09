import { test, expect } from '@playwright/test'

test.describe('Density picker writes data-density + localStorage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  async function selectDensity(
    page: import('@playwright/test').Page,
    name: 'Compact' | 'Normal' | 'Comfortable',
  ) {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('button', { name }).click()
  }

  test('clicking Compact sets compact', async ({ page }) => {
    await selectDensity(page, 'Compact')
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    const stored = await page.evaluate(() => localStorage.getItem('density'))
    expect(stored).toBe('compact')
  })

  test('clicking Comfortable sets comfortable', async ({ page }) => {
    await selectDensity(page, 'Comfortable')
    await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable')
    const stored = await page.evaluate(() => localStorage.getItem('density'))
    expect(stored).toBe('comfortable')
  })

  test('selection persists across reloads', async ({ page }) => {
    await selectDensity(page, 'Compact')
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.getByRole('button', { name: 'Display settings' }).click()
    // Picker rows are NavItem-styled buttons; the active row carries
    // aria-current="page" (the same chrome trigger NavItem uses for sidebar
    // selection).
    const popover = page.getByRole('dialog')
    const item = popover.getByRole('button', { name: 'Compact' })
    await expect(item).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('Docs sidebar active state', () => {
  test('clicking a sidebar link marks it aria-current=page', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.getByRole('link', { name: 'Button & IconButton', exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/components\/button$/)
    const active = page.locator('a[aria-current="page"]')
    await expect(active).toHaveAttribute('href', '/docs/components/button')
  })

  test('navigating to a different docs route updates the active link', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'webkit on CI flakes the post-click URL transition; chromium is stable. Tracked separately.',
    )
    await page.goto('/docs/components/button')
    let active = page.locator('a[aria-current="page"]')
    await expect(active).toHaveAttribute('href', '/docs/components/button')
    await page.getByRole('link', { name: 'Introduction', exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/getting-started$/)
    active = page.locator('a[aria-current="page"]')
    await expect(active).toHaveAttribute('href', '/docs/getting-started')
  })
})

test.describe('Docs preferences menu exposes the documented palettes', () => {
  test('default, sunset, cyberpunk, forest are listed and legacy names are not', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Display settings' }).click()
    // Palette options are now NavItem-styled buttons inside the popover.
    const popover = page.getByRole('dialog')
    await expect(popover).toBeVisible()
    await expect(popover.getByRole('button', { name: 'Plum+Gold' })).toBeVisible()
    await expect(popover.getByRole('button', { name: 'Sunset' })).toBeVisible()
    await expect(popover.getByRole('button', { name: 'Cyberpunk' })).toBeVisible()
    await expect(popover.getByRole('button', { name: 'Forest' })).toBeVisible()
    // gh-93: Neon was removed; legacy names from earlier iterations must not appear.
    await expect(popover.getByText(/^Neon$/i)).toHaveCount(0)
    await expect(popover.getByText(/frost/i)).toHaveCount(0)
    await expect(popover.getByText(/circuit/i)).toHaveCount(0)
  })
})
