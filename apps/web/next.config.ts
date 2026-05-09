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
}

export default withNextIntl(config)
