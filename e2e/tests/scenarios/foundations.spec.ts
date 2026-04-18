import { test, expect } from '@playwright/test'

test.describe('Foundations page', () => {
  test('renders all foundation sections', async ({ page }) => {
    await page.goto('/components/foundations')
    await expect(page.getByRole('heading', { name: 'Foundations', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Icons (30)' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Box' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Container' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'AspectRatio' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'ScrollArea' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Separator' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ornament' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'FormField' })).toBeVisible()
  })

  test('FormField wires aria-describedby and aria-invalid', async ({ page }) => {
    await page.goto('/components/foundations')
    const pwInput = page.locator('input[type="password"]').first()
    await expect(pwInput).toHaveAttribute('aria-invalid', 'true')
    const describedBy = await pwInput.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
  })
})
