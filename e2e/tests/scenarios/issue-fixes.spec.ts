import { test, expect } from '@playwright/test'

test.describe('DensitySwitcher writes data-density + localStorage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  test('clicking Compatta sets compact', async ({ page }) => {
    await page.getByRole('button', { name: 'Compatta' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    const stored = await page.evaluate(() => localStorage.getItem('density'))
    expect(stored).toBe('compact')
  })

  test('clicking Ampia sets comfortable', async ({ page }) => {
    await page.getByRole('button', { name: 'Ampia' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable')
    const stored = await page.evaluate(() => localStorage.getItem('density'))
    expect(stored).toBe('comfortable')
  })

  test('selection persists across reloads', async ({ page }) => {
    await page.getByRole('button', { name: 'Compatta' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    const btn = page.getByRole('button', { name: 'Compatta' })
    await expect(btn).toHaveAttribute('aria-pressed', 'true')
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

test.describe('PaletteSwitcher exposes the documented palettes', () => {
  test('default, neon, sunset are listed and legacy names are not', async ({ page }) => {
    await page.goto('/')
    // Radix Select renders the trigger as a combobox with the navbar header as
    // its accessible context. Use the role rather than internal class names.
    const trigger = page.getByRole('banner').getByRole('combobox').first()
    await trigger.click()
    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()
    const labels = (await listbox.getByRole('option').allTextContents()).map((t) => t.trim())
    expect(labels).toEqual(expect.arrayContaining(['Plum+Gold', 'Neon', 'Sunset']))
    expect(labels.some((l) => /frost/i.test(l))).toBe(false)
    expect(labels.some((l) => /circuit/i.test(l))).toBe(false)
  })
})
