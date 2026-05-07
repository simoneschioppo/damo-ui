import { test, expect, type Page } from '@playwright/test'

/**
 * AC-1 (J-13a) — Motion durations propagation
 *
 * Acceptance: when a `--duration-*` var is overridden at runtime on `<html>`,
 * any element with the matching `duration-*` utility MUST resolve its
 * `transition-duration` to the new value.
 *
 * Today this is broken because `apps/web/app/styles/theme.css` ships a
 * universal `@media (prefers-reduced-motion: reduce) { *, *::before, *::after
 * { transition-duration: 0.01ms !important } }`. Even though Playwright runs
 * with `prefers-reduced-motion=no-preference` by default (matching a normal
 * desktop user), the screenshot reported by the user shows generator edits
 * have no effect — confirming a real propagation issue beyond reduced motion.
 *
 * This spec drives BOTH paths:
 *  - default (no-preference): override MUST propagate
 *  - reduced-motion=reduce: a11y override MUST still win (intentional)
 */

test.describe('AC-1 — Theme generator motion durations propagate to consumers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/theme-generator')
    // The generator preview pane includes Accordion (closed by default) and
    // Progress; pick the Accordion chevron because its className contains the
    // `duration-base` utility we want to assert against.
    await page.waitForSelector('html')
  })

  test('overriding --duration-base resolves on a `duration-base` consumer', async ({ page }) => {
    // Pick a recognizable, non-default value so the assertion is unambiguous.
    const NEW_BASE_MS = 1500

    // Mutate the var at the document root (this is exactly what
    // applyThemeToRoot() does internally when the user types in the editor).
    await page.evaluate((ms) => {
      document.documentElement.style.setProperty('--duration-base', `${ms}ms`)
    }, NEW_BASE_MS)

    // The Accordion chevron in the components-preview scene uses
    // `transition-transform duration-base ease-memphis`. Resolve it.
    const computedDuration = await page.evaluate(() => {
      const chevron = document.querySelector<SVGElement>(
        // Accordion chevron is the `<svg>` inside the AccordionTrigger
        // with the `duration-base` utility class.
        'svg.duration-base',
      )
      if (!chevron) {
        // Fallback: any element with the literal duration-base class.
        const fallback = document.querySelector<HTMLElement>('.duration-base')
        if (!fallback) return null
        return getComputedStyle(fallback).transitionDuration
      }
      return getComputedStyle(chevron).transitionDuration
    })

    expect(computedDuration, 'a `duration-base` consumer must exist in the preview').not.toBeNull()
    // Browsers normalize transition-duration to seconds with ms precision.
    // Accept either "1.5s" or "1500ms" depending on engine.
    expect(['1.5s', '1500ms']).toContain(computedDuration)
  })

  test('overriding --duration-slow resolves on a `duration-slow` consumer', async ({ page }) => {
    const NEW_SLOW_MS = 1300

    await page.evaluate((ms) => {
      document.documentElement.style.setProperty('--duration-slow', `${ms}ms`)
    }, NEW_SLOW_MS)

    const computedDuration = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.duration-slow')
      if (!el) return null
      return getComputedStyle(el).transitionDuration
    })

    expect(computedDuration, 'a `duration-slow` consumer must exist in the preview').not.toBeNull()
    expect(['1.3s', '1300ms']).toContain(computedDuration)
  })

  test.describe('Reduced-motion contract', () => {
    /**
     * Design decision (AC-1): the global `prefers-reduced-motion: reduce`
     * collapse is scoped to `html:not([data-motion-preview])`. The
     * `/theme-generator` route always sets `data-motion-preview` on `<html>`
     * because its job IS to preview motion — collapsing every transition to
     * 0.01ms would defeat the editor's purpose. Every other route, and
     * every consumer app that lifts this stylesheet, keeps the strict a11y
     * collapse intact.
     *
     * Concretely: a user with `prefers-reduced-motion: reduce` who navigates
     * to `/theme-generator` will see motion in the preview pane. They opted
     * in by going to the editor.
     */
    test('on /theme-generator the motion-preview opt-out wins even for reduce users', async ({
      browser,
    }) => {
      const ctx = await browser.newContext({ reducedMotion: 'reduce' })
      const page = await ctx.newPage()
      await page.goto('/theme-generator')

      // Verify the opt-out attribute is set by the page mount effect.
      await expect(page.locator('html')).toHaveAttribute('data-motion-preview', '')

      await page.evaluate(() => {
        document.documentElement.style.setProperty('--duration-base', '1500ms')
      })

      const computed = await page.evaluate(() => {
        const el = document.querySelector<HTMLElement>('.duration-base')
        if (!el) return null
        return getComputedStyle(el).transitionDuration
      })

      expect(computed).not.toBeNull()
      // Override must propagate — this is the editor preview value, not the
      // a11y collapse.
      expect(['1.5s', '1500ms']).toContain(computed)
      await ctx.close()
    })

    test('on a non-editor route the a11y collapse still wins for reduce users', async ({
      browser,
    }) => {
      const ctx = await browser.newContext({ reducedMotion: 'reduce' })
      const page = await ctx.newPage()
      // Any route that does NOT set `data-motion-preview` keeps the strict
      // a11y collapse. The home / landing page is the simplest target.
      await page.goto('/')

      await expect(page.locator('html')).not.toHaveAttribute(
        'data-motion-preview',
        /.*/,
      )

      // Pick any element with a transition utility on this page (Button has
      // `transition-[…] duration-snap`). Mutate the var; verify the a11y
      // collapse still flattens the transition.
      await page.evaluate(() => {
        document.documentElement.style.setProperty('--duration-snap', '1500ms')
      })

      const computed = await page.evaluate(() => {
        const el = document.querySelector<HTMLElement>('button')
        if (!el) return null
        return getComputedStyle(el).transitionDuration
      })

      expect(computed).not.toBeNull()
      // Accept browser-normalized variants of "0.01ms".
      // Chromium emits scientific notation (1e-05s) for very small values.
      expect(['0.01ms', '0s', '0.0001s', '1e-05s']).toContain(computed)
      await ctx.close()
    })
  })
})
