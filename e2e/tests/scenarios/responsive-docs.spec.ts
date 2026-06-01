import { test, expect } from '@playwright/test'

// Self-contained viewports so this spec doesn't depend on a global mobile
// project (those land in the shared E2E story). Below `lg` (1024px) the docs
// sidebar collapses into a drawer opened from the mobile bar.
const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 900 }
const TOGGLE = /toggle navigation|navigazione/i

test.describe('Docs — mobile navigation drawer (< lg)', () => {
  test.use({ viewport: MOBILE })

  test('shows the hamburger, hides the sticky sidebar', async ({ page }) => {
    await page.goto('/docs/getting-started')
    // The inline desktop <aside> is not rendered/visible on mobile.
    await expect(page.locator('aside')).toBeHidden()
    await expect(page.getByRole('button', { name: TOGGLE })).toBeVisible()
  })

  test('opens the drawer, navigates, and closes on selection', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await page.getByRole('button', { name: TOGGLE }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Tap a nav link inside the drawer (select by href — labels vary by locale).
    await dialog.locator('a[href="/docs/components/button"]').click()
    await expect(page).toHaveURL(/\/docs\/components\/button$/)

    // Route change closes the drawer (DocsSidebar effect on pathname).
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/docs/getting-started')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('Docs — desktop navigation (>= lg)', () => {
  test.use({ viewport: DESKTOP })

  test('shows the sticky sidebar and hides the hamburger', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await expect(page.locator('aside').first()).toBeVisible()
    await expect(page.getByRole('button', { name: TOGGLE })).toBeHidden()
  })
})
