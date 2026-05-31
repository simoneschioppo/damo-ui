import path from 'node:path'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const uiSrc = path.resolve(__dirname, '../../packages/ui/src')

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['damo-ui'],
  webpack: (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      'damo-ui/mocks': path.join(uiSrc, 'mocks/index.ts'),
      'damo-ui': path.join(uiSrc, 'index.ts'),
    }
    return config
  },
  turbopack: {
    resolveAlias: {
      'damo-ui/mocks': path.join(uiSrc, 'mocks/index.ts'),
      'damo-ui': path.join(uiSrc, 'index.ts'),
    },
  },
  // The shadcn-style registry under /r is fetched cross-origin by the damo-ui
  // CLI and by browser-based tools. Allow any origin to GET it and answer
  // preflight requests; cache at the edge since it is regenerated per deploy.
  async headers() {
    return [
      {
        source: '/r/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=300, s-maxage=300' },
        ],
      },
    ]
  },
}

export default withNextIntl(config)
