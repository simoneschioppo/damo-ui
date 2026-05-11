import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    // Reset mock state between tests so a leak in one suite cannot poison
    // another. Cheap to enable and protects future contributors from a class
    // of flake that's hard to root-cause once it appears.
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/index.ts'],
      // Thresholds lock in the current cleanliness floor. Current baseline
      // (verified locally pre-PR-G): lines 90.72%, branches 87.9%, statements
      // 90.72%, functions 71.49%. We set the gates ~10% below baseline so
      // small refactors don't churn CI red, but a sloppy net regression does.
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 65,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
