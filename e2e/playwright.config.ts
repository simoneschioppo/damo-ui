import { defineConfig, devices } from '@playwright/test'

// Allow parallel git-worktree sessions to run their own dev server on a
// distinct port without colliding with the main checkout's :3000 instance.
// Override via `PW_PORT=3001` (or any free port). Defaults preserve CI behaviour.
const PORT = process.env.PW_PORT ?? '3000'
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './global-setup.ts',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    // CI uses the built `next start` artifact (PR #90 perf optimisation).
    // Local dev uses `next dev` for HMR; when PW_PORT overrides the default,
    // we bypass the web app's `dev` script (which hardcodes `--port 3000`)
    // and call `next dev --port <PW_PORT>` directly.
    command: process.env.CI
      ? 'pnpm --filter @damo/web start'
      : PORT === '3000'
        ? 'pnpm --filter @damo/web dev'
        : `pnpm --filter @damo/web exec next dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
