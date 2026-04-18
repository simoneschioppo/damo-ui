import { test, expect } from '@playwright/test'

test.describe('Smoke — playground boot', () => {
  test('home page renders TopBar brand', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('DAMACCHI · UI')).toBeVisible()
  })

  test('tokens page shows Plum scale section', async ({ page }) => {
    await page.goto('/tokens')
    await expect(page.getByRole('heading', { name: 'Plum scale' })).toBeVisible()
  })
})
