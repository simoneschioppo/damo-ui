import { test, expect } from '@playwright/test'

test.describe('Forms page', () => {
  test('renders all form sections', async ({ page }) => {
    await page.goto('/components/forms')
    await expect(page.getByRole('heading', { name: 'Form Inputs', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Text inputs' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Toggles' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Slider/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Select/ })).toBeVisible()
  })

  test('Input invalid renders aria-invalid and error text', async ({ page }) => {
    await page.goto('/components/forms')
    const pw = page.locator('input[type="password"]').first()
    await expect(pw).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Almeno 8 caratteri')).toBeVisible()
  })

  test('Switch toggles via click', async ({ page }) => {
    await page.goto('/components/forms')
    const sw = page.getByRole('switch', { name: 'Notifiche push' })
    await expect(sw).toHaveAttribute('data-state', 'checked')
    await sw.click()
    await expect(sw).toHaveAttribute('data-state', 'unchecked')
  })

  test('Select opens and selects a value', async ({ page }) => {
    await page.goto('/components/forms')
    const selectTrigger = page.locator('button[role="combobox"]').first()
    await selectTrigger.click()
    await page.getByRole('option', { name: 'Rage' }).click()
    await expect(selectTrigger).toContainText('Rage')
  })

  test('SegmentedControl selection updates text', async ({ page }) => {
    await page.goto('/components/forms')
    await page.getByRole('radio', { name: 'Rage', exact: true }).click()
    await expect(page.getByText(/Board mode: rage/)).toBeVisible()
  })
})
