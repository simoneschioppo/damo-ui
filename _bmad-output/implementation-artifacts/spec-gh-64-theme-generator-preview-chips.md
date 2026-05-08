---
title: 'GH-64 — Theme generator: inline preview chips for radius & shadow controls'
type: 'bugfix'
created: '2026-05-08'
status: 'done'
baseline_commit: 'f9f5c8e7114567ff80511ce665d29b9cc7344d92'
context:
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** In `/theme-generator`, the default `components` scene does not render visual consumers for `--radius-sm`, `--radius-selection`, and `--shadow-memphis-card`, so users editing those controls see no feedback unless they switch scenes (issue #64).

**Approach:** Pattern C from the issue — render an inline preview chip next to each radius and shadow-memphis sidebar control. Each chip applies the live CSS variable (`var(--radius-{k})`, `var(--shadow-memphis-{k})`) so it auto-updates as the reducer rewrites overrides — no extra state plumbing.

## Boundaries & Constraints

**Always:**
- Chips read from live CSS variables (`var(--radius-{k})`, `var(--shadow-memphis-{k})`) — never from raw reducer state. This is what couples them to the existing emit pipeline.
- Apply chips consistently across the entire `RADIUS_KEYS` loop and the entire `SHADOW_MEMPHIS_KEYS` loop. Mixing chip-bearing and chip-less controls inside one loop is forbidden.
- Each chip MUST have an `aria-label` and `data-testid` so tests and screen readers can locate it.
- Reuse existing layout primitives and tokens. No new design tokens, no Tailwind utility additions.

**Ask First:**
- Extending chips beyond the radius/shadow loops (e.g. to typography sizes, motion durations).
- Replacing the existing `DivergenceWrapper` `≠` indicator placement.
- Changing the `pairBlockStyle` / accordion structure of the IdentityEditor.

**Never:**
- Touching `_bmad/`, `core-knowledge/`, `user-data/`, or runtime token emitters (`use-theme-state.ts`, `theme-state.ts`, `exporters.ts`).
- Auto-switching scenes (pattern A) or adding a diagnostic scene (pattern B).
- Adding chips for tokens that already have a sidebar consumer (e.g. colors → `ColorPicker` already shows a swatch).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Radius slider edit | User drags `radius-sm` from 4→12 | Chip next to that control re-renders with new `border-radius` | N/A |
| Shadow color edit | User picks new color for `shadow-memphis-card` | Chip re-renders with new `box-shadow` color | N/A |
| Default state | Page loads with default theme | All radius chips and all shadow chips render with default tokens applied | N/A |
| Zero radius | User sets `radius-sm` to 0 | Chip renders sharp-cornered square (no error, no hidden chip) | N/A |
| Light/dark mode switch | User toggles edit mode | Chips reflect the currently rendered mode (driven by `:root` CSS vars) | N/A |

</frozen-after-approval>

## Code Map

- `apps/web/app/theme-generator/page.tsx` — IdentityEditor at lines 516–953 owns the radius (750–778) and shadow-memphis (789–851) loops. Insertion points for chips.
- `apps/web/app/theme-generator/theme-state.ts` — read-only here. `RadiusKey`, `ShadowMemphisKey`, `ShadowMemphisValue` types.
- `apps/web/app/theme-generator/use-theme-state.ts` — emits `--radius-*` and `--shadow-memphis-*` to a `<style>` override block. Read-only.
- `apps/web/app/theme-generator/radius-emit.test.tsx` — reference pattern for theme-generator vitest+jsdom tests.
- `packages/ui/src/components/chip/chip.tsx` — existing Chip primitive. Out of scope here (different concern); we ship a local component.

## Tasks & Acceptance

**Execution:**
- [x] `apps/web/app/theme-generator/token-preview-chip.test.tsx` -- TDD red-first vitest+jsdom tests covering: (a) radius variant emits inline `borderRadius: var(--radius-{k})`, (b) shadow variant emits inline `boxShadow: var(--shadow-memphis-{k})`, (c) data-testid is correct for each key, (d) aria-label present
- [x] `apps/web/app/theme-generator/token-preview-chip.tsx` -- create `TokenPreviewChip` component with two variants (`radius` and `shadow-memphis`) keyed by token id; renders a 28×28 box with `var(--radius-{k})` or `var(--shadow-memphis-{k})` applied; emits `aria-label` and `data-testid="token-preview-chip-{variant}-{k}"` -- minimal impl to turn tests green
- [x] `apps/web/app/theme-generator/page.tsx` -- import `TokenPreviewChip`; inside the radius loop (line 750) place a chip in the `<Label>` row alongside `{k} · {value}px`; inside the shadow-memphis loop (line 789) place a chip in the existing `<Label>` row at the top of `pairBlockStyle` -- minimal surgical edit, zero changes outside the two loops

**Acceptance Criteria:**
- Given the `/theme-generator` page is loaded with default theme, when the IdentityEditor "radius" accordion is open, then six chips render — one per `RADIUS_KEYS` entry — each with `data-testid="token-preview-chip-radius-{k}"` and inline `borderRadius` containing `var(--radius-{k})`.
- Given the IdentityEditor "shadow" accordion is open, when default state, then six chips render — one per `SHADOW_MEMPHIS_KEYS` entry — each with `data-testid="token-preview-chip-shadow-memphis-{k}"` and inline `boxShadow` containing `var(--shadow-memphis-{k})`.
- Given any chip is rendered, when inspected, then it has a non-empty `aria-label` describing the token.
- Given pre-existing tests `pnpm --filter @damo/web test`, when run, then all suites pass (no regressions in `radius-emit.test.tsx`, `reducer.test.ts`, etc.).

## Spec Change Log

## Verification

**Commands:**
- `pnpm --filter @damo/web test` -- expected: all vitest suites green, including the new `token-preview-chip.test.tsx`
- `pnpm --filter @damo/web typecheck` -- expected: no TS errors
- `pnpm --filter @damo/web lint` -- expected: no new lint errors

**Manual checks (if no CLI):**
- Open `/theme-generator`. Identity tab → Radius accordion: each radius slider has a small live-updating chip showing the corner shape. Drag `sm`, `selection`: chip shape changes in real time.
- Identity tab → Shadow accordion: each shadow block has a chip showing the live shadow. Edit `card` x/y/color: chip updates.
- Toggle light/dark mode: chips reflect the active mode (CSS variables driven).

## Suggested Review Order

**Chip contract**

- Discriminated union locks `variant` to its matching `tokenKey` at the type level
  [`token-preview-chip.tsx:6`](../../apps/web/app/theme-generator/token-preview-chip.tsx#L6)

- The `md` emitter quirk: bare `--shadow-memphis` instead of `-md` suffix
  [`token-preview-chip.tsx:37`](../../apps/web/app/theme-generator/token-preview-chip.tsx#L37)

- Stateless render — chip resolves CSS vars at paint time, no React subscriptions
  [`token-preview-chip.tsx:46`](../../apps/web/app/theme-generator/token-preview-chip.tsx#L46)

**Sidebar integration**

- Radius loop: chip joins the existing label row via `pairHeaderStyle`
  [`page.tsx:756`](../../apps/web/app/theme-generator/page.tsx#L756)

- Shadow loop: same pattern wraps the bare `<Label>` so layout stays consistent
  [`page.tsx:805`](../../apps/web/app/theme-generator/page.tsx#L805)

**Tests**

- `satisfies Record<Key, true>` makes union drift a compile error, not a runtime miss
  [`token-preview-chip.test.tsx:16`](../../apps/web/app/theme-generator/token-preview-chip.test.tsx#L16)

- Regression guard for the `md` alias quirk
  [`token-preview-chip.test.tsx:51`](../../apps/web/app/theme-generator/token-preview-chip.test.tsx#L51)
