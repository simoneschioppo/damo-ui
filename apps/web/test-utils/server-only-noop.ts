// In Next.js, `import 'server-only'` throws at runtime when the module is
// inadvertently bundled into a client bundle. Inside Vitest the test runner
// just executes ESM directly with no client/server distinction, so the guard
// fires and breaks tests for code that is otherwise pure logic. This noop
// replaces the package only inside tests via the resolve alias in
// vitest.config.ts; production builds keep the real guard.
export {}
