import type { MetadataRoute } from 'next'
import { DOCS_NAV } from './docs/_components/docs-nav'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://damo-ui.com'

// All public routes: the landing + theme generator + the docs index, plus
// every entry in the docs sidebar (getting-started, CLI, foundations,
// components). DOCS_NAV is the single source of truth for the docs routes.
export default function sitemap(): MetadataRoute.Sitemap {
  const docRoutes = DOCS_NAV.flatMap((group) => group.entries.map((entry) => entry.slug))
  const paths = [...new Set(['/', '/docs', '/theme-generator', ...docRoutes])]

  return paths.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : path.startsWith('/docs/components/') ? 0.6 : 0.8,
  }))
}
