import { test, expect } from '@playwright/test'

/**
 * E2E coverage for the docs-site preferences menu in the topbar.
 *
 * Cycle 9 replaced the removed `SettingsMenu` preset with a Popover that
 * hosts three AttrToggleGroup instances (theme = segmented, palette = select,
 * density = segmented). The cog `IconButton` still uses
 * `aria-label="Display settings"` so the trigger lookup is unchanged; the
 * dropdown is now `role="dialog"` (Radix Popover Content) and the radio items
 * are plain segmented buttons with `aria-pressed`.
 */
test.describe('Docs preferences menu (topbar cog)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  test('trigger is visible on the home page', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Display settings' })).toBeVisible()
  })

  test('opens the popover and shows the three axes', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    // Radix Popover Content renders as role="dialog".
    const popover = page.getByRole('dialog')
    await expect(popover).toBeVisible()
    // Each AttrToggleGroup label is rendered as an .eyebrow span.
    await expect(popover.getByText('Theme', { exact: true })).toBeVisible()
    await expect(popover.getByText('Palette', { exact: true })).toBeVisible()
    await expect(popover.getByText('Density', { exact: true })).toBeVisible()
  })

  test('selecting Dark sets data-theme and persists', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('button', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const persisted = await page.evaluate(() => window.localStorage.getItem('theme'))
    expect(persisted).toBe('dark')
  })

  test('persists across reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Display settings' }).click()
    await page.getByRole('button', { name: 'Compact' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact')
  })

  test('sanitizes an unknown persisted palette to the default', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('palette', 'totally-unknown-palette')
    })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'default')
    // The data-palette write and the localStorage write happen in the same
    // useEffect tick but webkit occasionally surfaces a microtask gap where
    // the attribute lands before the storage. Poll the storage to ride out
    // that gap rather than reading it once.
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('palette')))
      .toBe('default')
  })

  test('keeps the trigger visually pressed for the popover lifetime', async ({ page }) => {
    // Radix releases :active on the trigger as soon as the portal takes focus,
    // so the Memphis press animation visibly snaps back mid-flight. The fix
    // mirrors the active styles via data-[state=open] so the trigger stays
    // engaged (translate 3px, smaller offset shadow) while the popover is
    // open and only releases when the popover closes.
    const trigger = page.getByRole('button', { name: 'Display settings' })

    async function pressState() {
      return trigger.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return { translate: style.translate, boxShadow: style.boxShadow }
      })
    }

    await expect(trigger).toHaveAttribute('data-state', 'closed')
    const resting = await pressState()
    expect(resting.translate === 'none' || resting.translate === '0px 0px').toBe(true)
    const restingShadow = resting.boxShadow

    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(trigger).toHaveAttribute('data-state', 'open')
    const open = await pressState()
    expect(open.translate).toBe('3px 3px')
    expect(open.boxShadow).not.toBe(restingShadow)

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(trigger).toHaveAttribute('data-state', 'closed')
    await page.mouse.move(0, 0)
    await expect
      .poll(async () => (await pressState()).translate, { timeout: 2_000 })
      .toMatch(/^(none|0px 0px)$/)
  })

  test('opens via keyboard from a focused trigger and supports keyboard selection', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Display settings' })
    await trigger.focus()
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    const dark = page.getByRole('button', { name: 'Dark' })
    await dark.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
