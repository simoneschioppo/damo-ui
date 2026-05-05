import { test, expect } from '@playwright/test'

test.describe('Docs shell', () => {
  test('redirects /docs to /docs/getting-started', async ({ page }) => {
    await page.goto('/docs')
    await expect(page).toHaveURL(/\/docs\/getting-started$/)
  })

  test('docs sidebar lists all expected groups', async ({ page }) => {
    await page.goto('/docs/getting-started')
    const sidebar = page.getByRole('complementary').or(page.locator('aside'))
    await expect(page.getByText('Getting Started', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Foundations', { exact: true }).first()).toBeVisible()
    // Components are split across multiple groups (Primitives, Actions &
    // Surfaces, Forms, Feedback, Navigation, Theme controls, Data display,
    // Layout, Showcase / DS) — assert the major ones surface.
    await expect(page.getByText('Primitives', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Forms', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Feedback', { exact: true }).first()).toBeVisible()
    expect(await sidebar.count()).toBeGreaterThan(0)
  })

  test('Getting Started shows the install snippet as a syntax-highlighted code block', async ({
    page,
  }) => {
    await page.goto('/docs/getting-started')
    const bashBlocks = page.locator('pre[data-lang="bash"]')
    expect(await bashBlocks.count()).toBeGreaterThanOrEqual(2)
    const installBlock = bashBlocks.filter({ hasText: 'pnpm add @damo/ui' }).first()
    await expect(installBlock).toBeVisible()
  })

  test('every code block exposes a Copy button with an accessible name', async ({ page }) => {
    await page.goto('/docs/getting-started')
    const copyButtons = page.getByRole('button', { name: /copy code/i })
    expect(await copyButtons.count()).toBeGreaterThan(0)
  })

  test('Button page renders props table and live examples', async ({ page }) => {
    await page.goto('/docs/components/button')
    await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()
    await expect(page.getByText('Button props', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save' }).first()).toBeVisible()
  })

  test('navbar Docs link routes to /docs', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Docs', exact: true }).click()
    await expect(page).toHaveURL(/\/docs/)
  })

  const ALL_DOCS_ROUTES = [
    '/docs/getting-started',
    '/docs/foundations/tokens',
    '/docs/foundations/theming',
    '/docs/foundations/colors',
    '/docs/foundations/typography',
    '/docs/foundations/patterns',
    '/docs/components/button',
    '/docs/components/card',
    '/docs/components/dialog',
    '/docs/components/input',
    '/docs/components/app-top-bar',
    '/docs/components/sidebar',
    '/docs/components/theme-switcher',
  ] as const

  for (const route of ALL_DOCS_ROUTES) {
    test(`renders an h1 at ${route}`, async ({ page }) => {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })
  }
})
