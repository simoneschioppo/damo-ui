import { test, expect } from '@playwright/test'

test.describe('Tier 1 page', () => {
  test('renders all Tier 1 sections', async ({ page }) => {
    await page.goto('/components/tier1')
    await expect(page.getByRole('heading', { name: 'Tier 1 Core', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'IconButton' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /^Card/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dialog', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'AlertDialog' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /^Drawer/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /^Banner/ })).toBeVisible()
  })

  test('Dialog opens and closes', async ({ page }) => {
    await page.goto('/components/tier1')
    await page.getByRole('button', { name: 'Apri dialog' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Dialog Memphis')).toBeVisible()
    await page.getByRole('button', { name: 'Annulla' }).first().click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('AlertDialog danger opens with title and action', async ({ page }) => {
    await page.goto('/components/tier1')
    await page
      .getByRole('button', { name: /Elimina/ })
      .first()
      .click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await expect(page.getByText('Eliminare il profilo?')).toBeVisible()
    await page.getByRole('button', { name: 'No' }).click()
    await expect(page.getByRole('alertdialog')).not.toBeVisible()
  })

  test('Drawer opens from right and closes with Esc', async ({ page }) => {
    await page.goto('/components/tier1')
    await page.getByRole('button', { name: 'right', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Drawer right')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('Banner dismissible can be closed', async ({ page }) => {
    await page.goto('/components/tier1')
    const dismissibleBanner = page.getByText('Partita salvata').first()
    await expect(dismissibleBanner).toBeVisible()
    // Find the dismiss button in the same banner
    const bannerParent = dismissibleBanner.locator(
      'xpath=ancestor::div[@role="status" or @role="alert"]',
    )
    await bannerParent.getByRole('button', { name: 'Chiudi' }).click()
    await expect(dismissibleBanner).not.toBeVisible()
  })
})
