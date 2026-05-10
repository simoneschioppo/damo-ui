import { request } from '@playwright/test'

const PORT = process.env.PW_PORT ?? '3000'
const BASE_URL = `http://localhost:${PORT}`

const PREWARM_ROUTES = [
  '/docs/getting-started',
  '/docs/foundations/patterns',
  '/docs/foundations/tokens',
]

export default async function globalSetup() {
  const ctx = await request.newContext({ baseURL: BASE_URL })
  await Promise.all(PREWARM_ROUTES.map((r) => ctx.get(r).catch(() => undefined)))
  await ctx.dispose()
}
