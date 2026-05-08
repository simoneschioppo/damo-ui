# Testing (Library)

Status: documented · Last scan: 43a7a02 · Sources:
`packages/ui/vitest.config.ts`, `packages/ui/vitest.setup.ts`,
`packages/ui/src/mocks/`, `packages/ui/src/styles/__tests__/`,
`packages/ui/src/components/**/*.test.{ts,tsx}`.

## Summary

Library tests run on **Vitest + jsdom** with React Testing Library
for component-level assertions. The suite covers two complementary
tiers:

1. **Behavioral tests** — render a component, assert the DOM, drive
   user interactions. Co-located with each component
   (`packages/ui/src/components/<name>/<name>.test.tsx`).
2. **Source-contract tests** — read theme/token sources as text and
   assert structural invariants by regex. These guard CSS-bridge
   regressions that jsdom cannot detect at runtime (jsdom does not
   process `@theme inline` or external CSS).

Cross-browser runtime assertions on the Tailwind bridge belong in
the repo-level Playwright suite (`/e2e`), not here. See
`30-cross-cutting/15-e2e.md`.

Current count: **464 tests** (was 373 prior to the trace-audit
expansion in 2026-05).

## Vitest configuration

`packages/ui/vitest.config.ts`:

- `environment: 'jsdom'` — DOM APIs available, no browser CSS engine.
- `setupFiles: ['./vitest.setup.ts']` — registers RTL matchers and
  any global mocks.
- `globals: true` — `describe`, `it`, `expect` available without
  imports.
- `coverage.provider: 'v8'` with `text`, `html`, `lcov` reporters.
- Coverage `include: ['src/**/*.{ts,tsx}']`, excluding stories,
  test files themselves, and the barrel index.
- Path alias `@` → `./src`.

## Test taxonomy

### Behavioral / component tests

- Co-located: `<component>/<component>.test.tsx`.
- Use React Testing Library: `render`, `screen.getByRole`, fire user
  events via `@testing-library/user-event`.
- Prefer accessibility queries (`getByRole`, `getByLabelText`) over
  `getByTestId` — the lib's a11y story is part of the contract.
- Render in real Radix portals where applicable; do not stub.

Examples:
- `dialog/dialog.test.tsx` — severity / tone / hideClose / portal
- `nav-item/nav-item.test.tsx` — `aria-current="page"` driving the
  selection chrome
- `radio-group/radio-group.test.tsx` — Radix value/onValueChange

### Source-contract tests (under `src/styles/__tests__/`)

These tests **read source files as strings and grep for invariants**.
They run in jsdom but do not touch the DOM at all — they simply
guard textual contracts that jsdom cannot otherwise enforce.

| File | Asserts |
|------|---------|
| `theme-bridge-coverage.test.ts` | every Damo token used by a component is bridged in `theme.css` to the corresponding Tailwind utility namespace |
| `chart-tokens.test.ts` | `--chart-1..5` present in `tokens.css` and bridged in `theme.css` (regression guard for J-08a) |
| `typography-bridge.test.ts` | `--text-xs..3xl` re-declared in `@theme inline` so runtime overrides flow through (regression guard for J-10 / AC-2) |
| `contrast-utils.test.ts` | the WCAG contrast helpers behave correctly across hex/luminance/ratio/AA |

Component-side counterparts:

| File | Asserts |
|------|---------|
| `medal/medal.tokens.test.ts` | the 15 `--medal-*` tokens are all referenced by name in `medal.tsx` |
| `nav-item/nav-item.tone-on-dark.test.ts` | the legacy gold/plum rgba literals are absent and the gradient reads from `--nav-on-dark-accent`/`-strong` via `color-mix(in oklab, …)` |

### Mocks scaffolding (`src/mocks/`)

Lightweight stubs (`ResizeObserver`, `matchMedia`, …) registered in
`vitest.setup.ts`. Add a mock here only when:
- jsdom genuinely lacks the API; and
- multiple tests need it.

Per-test mocks belong inside the test file via `vi.mock`.

## Coverage policy

Targets per the global testing rules
(`~/.claude/rules/testing.md`):

- 80% minimum overall.
- 100% required for token-bridge contracts (the source-contract tier
  exists precisely to keep this guarantee mechanical).

Critical user flows continue to be covered at the repo level via
Playwright. The library's job is to keep its **token contracts** and
**component primitives** correct in isolation; integration with the
docs site / theme generator is exercised by `/e2e`.

## Two-tier coverage strategy

**Why two tiers, not one.** Memphis shadow tokens, Tailwind v4
bridges, and the runtime `:root` overrides emitted by the theme
generator all involve CSS that jsdom does not parse. A purely-jsdom
Vitest run cannot prove that editing `--primary` actually re-tints
the `bg-primary` utility in a real browser. Two tiers cover the gap:

1. **Tier 1 (this suite, lib-side):** source-contract tests prove
   the token is *bridged correctly* — that the textual mapping in
   `theme.css` exists and is shaped right. Cheap, reliable, fast.
2. **Tier 2 (`/e2e`, repo-level):** Playwright drives the live
   `/theme-generator` page in chromium and webkit, mutates a token
   on `:root`, and reads `getComputedStyle(consumer).property` to
   assert the value actually flowed through. Slower but real.

The trace-audit expansion in 2026-05 produced
`e2e/tests/scenarios/theme-generator-comprehensive-token-audit.spec.ts`
(64 parametric tests covering 50 component-tracked tokens) which is
the canonical Tier-2 reference.

## Running locally

```bash
# Lib tests only
pnpm --filter @damo/ui test

# With coverage
pnpm --filter @damo/ui test --coverage

# Watch mode
pnpm --filter @damo/ui test --watch
```

CI runs the full lib suite on every push (see
`30-cross-cutting/10-ci-cd.md`).

## Open questions

1. The source-contract tier currently lives under
   `src/styles/__tests__/` plus ad-hoc files near components. A
   dedicated `src/__tests__/contracts/` folder might make the tier
   easier to spot when scanning the repo.
2. Coverage is computed but not enforced as a CI gate today. Worth
   adding a threshold check so regressions show up in PRs.
3. Several mocks are duplicated across component test files. A
   consolidated `mocks/dom.ts` + auto-applied via `vitest.setup.ts`
   would reduce drift.
