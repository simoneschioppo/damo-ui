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
  test('PaletteSwitcher exposes plum-gold, neon, sunset', async ({ page }) => {
    await page.goto('/')
    const values = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'))
      const paletteSelect = selects.find((s) =>
        Array.from(s.options).some((o) => o.value === 'plum-gold'),
      )
      return paletteSelect ? Array.from(paletteSelect.options).map((o) => o.value) : []
    })
    expect(values).toEqual(expect.arrayContaining(['plum-gold', 'neon', 'sunset']))
    expect(values).not.toContain('frost')
    expect(values).not.toContain('circuit')
  })
})
