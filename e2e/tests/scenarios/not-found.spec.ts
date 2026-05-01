import { test, expect } from '@playwright/test'

test.describe('404 page', () => {
  test('renders the mascot and a link home for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-i-promise')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('main').locator('img[src="/mascot.png"]')).toBeVisible()
    const homeLink = page
      .getByRole('main')
      .getByRole('link', { name: /home|back/i })
      .first()
    await expect(homeLink).toBeVisible()
  })
})
