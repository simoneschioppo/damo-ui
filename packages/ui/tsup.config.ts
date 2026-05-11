import { defineConfig } from 'tsup'
import { execFileSync } from 'node:child_process'

export default defineConfig({
  entry: ['src/index.ts', 'src/mocks/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,
  minify: false,
  async onSuccess() {
    // Post-build: dedup `//# sourceMappingURL=` lines + prepend "use client"
    // on the consumer entry points. Logic lives in scripts/post-build.mjs so
    // the tailwind.preset.js build (separate tsup invocation) can call the
    // same script — see packages/ui/package.json `build:preset`.
    execFileSync('node', ['scripts/post-build.mjs', 'dist/index.js', 'dist/mocks/index.js'], {
      stdio: 'inherit',
    })
  },
})
