import { test, expect } from '@playwright/test'

test.describe('Favicon suite (#78)', () => {
  test('emits the full set of icon and manifest <link> tags from Next metadata', async ({
    page,
  }) => {
    await page.goto('/')

    const icon32 = page.locator('link[rel="icon"][sizes="32x32"]')
    const icon16 = page.locator('link[rel="icon"][sizes="16x16"]')
    const apple = page.locator('link[rel="apple-touch-icon"]')
    const shortcut = page.locator('link[rel="shortcut icon"]')
    const manifest = page.locator('link[rel="manifest"]')

    await expect(icon32).toHaveCount(1)
    await expect(icon16).toHaveCount(1)
    await expect(apple).toHaveCount(1)
    await expect(shortcut).toHaveCount(1)
    await expect(manifest).toHaveCount(1)

    await expect(icon32).toHaveAttribute('href', /\/favicon-32x32\.png/)
    await expect(icon16).toHaveAttribute('href', /\/favicon-16x16\.png/)
    await expect(apple).toHaveAttribute('href', /\/apple-touch-icon\.png/)
    await expect(shortcut).toHaveAttribute('href', /\/favicon\.ico/)
    await expect(manifest).toHaveAttribute('href', /\/site\.webmanifest/)
  })

  test('emits a <meta name="theme-color"> tag from the viewport export', async ({ page }) => {
    await page.goto('/')
    const themeColor = page.locator('meta[name="theme-color"]')
    await expect(themeColor).toHaveCount(1)
    await expect(themeColor).toHaveAttribute('content', '#7a3980')
  })

  test.describe('asset reachability', () => {
    const targets = [
      { path: '/favicon.ico', type: /image\/(x-icon|vnd\.microsoft\.icon)/ },
      { path: '/favicon-16x16.png', type: /image\/png/ },
      { path: '/favicon-32x32.png', type: /image\/png/ },
      { path: '/apple-touch-icon.png', type: /image\/png/ },
      { path: '/android-chrome-192x192.png', type: /image\/png/ },
      { path: '/android-chrome-512x512.png', type: /image\/png/ },
      { path: '/site.webmanifest', type: /application\/(manifest\+json|json)/ },
    ]

    for (const { path, type } of targets) {
      test(`${path} responds 200 with correct Content-Type`, async ({ request }) => {
        const res = await request.get(path)
        expect(res.status()).toBe(200)
        const ct = res.headers()['content-type'] ?? ''
        expect(ct).toMatch(type)
      })
    }
  })

  test('site.webmanifest carries the brand theme color', async ({ request }) => {
    const res = await request.get('/site.webmanifest')
    expect(res.status()).toBe(200)
    const m = (await res.json()) as {
      theme_color: string
      icons: Array<{ src: string; sizes: string }>
    }
    expect(m.theme_color).toBe('#7a3980')
    const sizes = new Set(m.icons.map((i) => i.sizes))
    expect(sizes.has('192x192')).toBe(true)
    expect(sizes.has('512x512')).toBe(true)
  })
})
