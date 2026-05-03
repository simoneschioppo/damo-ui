import { test, expect } from '@playwright/test'

test.describe('Home hero', () => {
  test('shows the mascot inside the hero section', async ({ page }) => {
    await page.goto('/')
    const heroSection = page.getByRole('main')
    await expect(heroSection).toBeVisible()
    const heroMascot = heroSection.locator('img[src="/mascot-hero.png"]')
    await expect(heroMascot).toBeVisible()
  })

  test('headline mentions the library', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Damo UI/)
  })

  test('routes the primary CTA to /docs', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /Browse docs/i })
    await expect(cta).toBeVisible()
    await cta.click()
    await expect(page).toHaveURL(/\/docs/)
  })

  test('routes the secondary CTA to /theme-generator', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /Theme Generator|Open theme generator/i }).first()
    await expect(cta).toBeVisible()
    await cta.click()
    await expect(page).toHaveURL(/\/theme-generator/)
  })
})
