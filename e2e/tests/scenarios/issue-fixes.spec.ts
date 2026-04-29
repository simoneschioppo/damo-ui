import { test, expect } from '@playwright/test'

test.describe('Issue #1 — DensitySwitcher writes data-density + localStorage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system')
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

test.describe('Issue #3 — TOC active state', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system')
  })

  test('clicking a TOC link marks it aria-current=true', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Page sections' })
      .getByRole('link', { name: /Cards/ })
      .click()
    const active = page.locator('a[aria-current="true"]')
    await expect(active).toHaveAttribute('href', '#cards')
  })

  test('scrolling into a later section updates TOC active', async ({ page }) => {
    await page.evaluate(() =>
      document.getElementById('patterns')?.scrollIntoView({ block: 'start' }),
    )
    // Allow IntersectionObserver to fire
    await page.waitForFunction(() => {
      const a = document.querySelector('a[aria-current="true"]')
      return a?.getAttribute('href') === '#patterns'
    })
    const active = page.locator('a[aria-current="true"]')
    await expect(active).toHaveAttribute('href', '#patterns')
  })
})

test.describe('Issue #4 — hero pattern stat matches #patterns section', () => {
  test('hero count equals PatternSwatch count in #patterns', async ({ page }) => {
    await page.goto('/design-system')
    // Hero <header> lives inside <main>, distinguishing it from the AppTopBar
    const heroText = await page
      .locator('main header span')
      .filter({ hasText: /pattern/i })
      .textContent()
    expect(heroText?.trim()).toBe('8 pattern')
  })
})

test.describe('Issue #2 — README documents real palette values', () => {
  test('PaletteSwitcher exposes default (plum+gold), neon, sunset', async ({ page }) => {
    await page.goto('/')

    // PaletteSwitcher uses a Radix Select — open the dropdown, then read
    // the listbox items by their textContent.
    const trigger = page.locator('span.eyebrow:has-text("Palette") + button').first()
    await trigger.click()
    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()
    const labels = (await listbox.getByRole('option').allTextContents()).map((t) => t.trim())
    expect(labels).toEqual(expect.arrayContaining(['Plum+Gold', 'Neon', 'Sunset']))
    expect(labels.some((l) => /frost/i.test(l))).toBe(false)
    expect(labels.some((l) => /circuit/i.test(l))).toBe(false)
  })
})
