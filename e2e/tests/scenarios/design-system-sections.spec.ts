import { test, expect } from '@playwright/test'

/**
 * The /design-system specimen page was retired in favour of the new /docs
 * surface. We keep this spec to guard against the redirect being silently
 * removed: external links and historic e2e expectations still flow through
 * the legacy URL.
 */
test.describe('Legacy design-system URL', () => {
  test('permanently redirects to /docs', async ({ page }) => {
    const response = await page.goto('/design-system')
    expect(response).not.toBeNull()
    await expect(page).toHaveURL(/\/docs/)
  })

  test('lands the visitor on Getting Started after the redirect chain', async ({ page }) => {
    await page.goto('/design-system')
    await expect(page).toHaveURL(/\/docs\/getting-started$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
