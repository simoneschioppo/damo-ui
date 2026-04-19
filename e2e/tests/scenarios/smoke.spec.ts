import { test, expect } from '@playwright/test'

test.describe('Smoke — playground boot', () => {
  test('home page renders TopBar brand', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('DAMACCHI · UI')).toBeVisible()
  })

  test('home page links to Design System', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Design System/i }).first()).toBeVisible()
  })

  test('design-system page loads', async ({ page }) => {
    await page.goto('/design-system')
    await expect(page).toHaveURL(/\/design-system/)
  })
})
