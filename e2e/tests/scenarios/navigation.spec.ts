import { test, expect } from '@playwright/test'

test.describe('Navigation page', () => {
  test('renders all sections', async ({ page }) => {
    await page.goto('/components/navigation')
    await expect(page.getByRole('heading', { name: 'Navigation', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tabs' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'DropdownMenu' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /ContextMenu/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'NavItem' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Breadcrumbs' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Pagination' })).toBeVisible()
  })

  test('Tabs switch content', async ({ page }) => {
    await page.goto('/components/navigation')
    await expect(page.getByText('Contenuto Overview della partita.')).toBeVisible()
    await page.getByRole('tab', { name: 'Dettagli' }).click()
    await expect(page.getByText('Contenuto Dettagli — statistiche.')).toBeVisible()
    await page.getByRole('tab', { name: 'Storia' }).click()
    await expect(page.getByText('Contenuto Storia — partite recenti.')).toBeVisible()
  })

  test('DropdownMenu opens and shows items', async ({ page }) => {
    await page.goto('/components/navigation')
    await page.getByRole('button', { name: 'Azioni' }).click()
    await expect(page.getByRole('menuitem', { name: /Profilo/ })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: /Esci/ })).toBeVisible()
    await page.keyboard.press('Escape')
  })

  test('Pagination click navigates and updates current', async ({ page }) => {
    await page.goto('/components/navigation')
    const p2 = page.getByRole('button', { name: 'Pagina 2' }).first()
    await p2.click()
    await expect(p2).toHaveAttribute('aria-current', 'page')
  })

  test('Breadcrumbs show current page marker', async ({ page }) => {
    await page.goto('/components/navigation')
    await expect(page.getByText('Partita #1842')).toHaveAttribute('aria-current', 'page')
  })
})
