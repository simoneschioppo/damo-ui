import { defineConfig } from 'tsup'
import { execFileSync } from 'node:child_process'

export default defineConfig({
  entry: ['src/index.ts', 'src/mocks/index.ts'],
  format: ['esm'],
  // DTS emission is delegated to `tsc -p tsconfig.dts.json` (see
  // `build:types` in package.json). tsup's bundled DTS doesn't emit
  // declaration maps — consumers using "Go to Definition" land on the
  // .d.ts instead of the source. The per-file tsc output, with maps,
  // restores IDE source navigation.
  dts: false,
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
