---
stepsCompleted: ['step-01-preflight-and-context']
lastStep: 'step-01-preflight-and-context'
lastSaved: '2026-05-07'
storyId: 'theme-generator-token-propagation-2026-05-07'
storyKey: 'theme-generator-token-propagation-2026-05-07'
storyFile: '_bmad-output/test-artifacts/traceability/traceability-matrix.md'
atddChecklistPath: '_bmad-output/test-artifacts/atdd-checklist-theme-generator-token-propagation-2026-05-07.md'
generatedTestFiles: []
inputDocuments:
  - _bmad-output/test-artifacts/traceability/traceability-matrix.md
  - _bmad-output/test-artifacts/traceability/e2e-trace-summary.json
  - _bmad-output/test-artifacts/traceability/gate-decision.json
  - apps/web/app/theme-generator/use-theme-state.ts
  - apps/web/app/styles/theme.css
  - packages/ui/src/styles/theme.css
  - packages/ui/src/components/dialog/dialog.test.tsx
  - e2e/tests/scenarios/density-effect.spec.ts
detectedStack: 'frontend'
---

# ATDD Checklist — Theme generator → component runtime propagation

**Owner:** Murat (TEA) · **Driver:** Simone · **Date:** 2026-05-07
**Trigger:** trace gate FAIL — see `traceability-matrix.md`.
**Communication:** Italiano · **Doc language:** English.

## Stack & framework

- **Detected stack:** frontend (React 19 + Next 15 + Vitest 2 + Playwright)
- **Lib unit tests:** Vitest + jsdom in `packages/ui/src/components/**/*.test.tsx`
- **App unit/integration tests:** Vitest + jsdom in `apps/web/app/theme-generator/*.test.{ts,tsx}`
- **E2E tests:** Playwright in `e2e/tests/scenarios/*.spec.ts`
- **No `tea_use_playwright_utils` setup** in repo (config flag default; not used here)

## Acceptance criteria (from trace)

| AC   | Journey  | Coverage today | Goal                                                                                    | Test stack          |
|------|----------|----------------|-----------------------------------------------------------------------------------------|---------------------|
| AC-1 | J-13a    | NONE — DEFECT  | `--duration-*` runtime override propagates to component transition-duration            | Vitest + jsdom      |
| AC-2 | J-10     | PARTIAL — MUTE-RISK | `--text-*` runtime override propagates to component computed font-size            | Vitest + jsdom      |
| AC-3 | J-08b    | NONE           | `--nav-on-dark-accent*` propagate to NavItem onDark gradient (no hard-coded literals)  | Vitest + jsdom      |
| AC-4 | J-08a    | NONE           | `--chart-1..5` propagate to elements using `bg-chart-*` / `text-chart-*` utilities      | Vitest + jsdom      |
| AC-5 | J-08c    | NONE           | `--app-pattern-*` propagate to consumer-side pattern surfaces                          | Playwright (E2E)    |

## Test placement

| AC   | File path (new or appended)                                                                       |
|------|---------------------------------------------------------------------------------------------------|
| AC-1 | `packages/ui/src/components/accordion/accordion.duration.integration.test.tsx` (new, integration suffix to flag computed-style scope) |
| AC-2 | `packages/ui/src/styles/__tests__/typography-tokens.integration.test.tsx` (new) |
| AC-3 | `packages/ui/src/components/nav-item/nav-item.tone-on-dark.integration.test.tsx` (new) |
| AC-4 | `packages/ui/src/styles/__tests__/chart-tokens.integration.test.tsx` (new) |
| AC-5 | `e2e/tests/scenarios/theme-generator-app-pattern.spec.ts` (new) |

## Implementation checklist (drive each test to GREEN)

### AC-1 — Motion durations DEFECT

**Failing test asserts:** with `prefers-reduced-motion=no-preference`, mutating
`--duration-base` on `:root` and rendering an element with `class="duration-base"`
yields `getComputedStyle(el).transitionDuration === "<new-value>ms"`.

**Smallest fix candidates:**

1. **Scope the reduced-motion override** in `apps/web/app/styles/theme.css`:
   - Replace the universal `*, *::before, *::after { transition-duration: 0.01ms !important }` with a class-gated rule (`.respect-reduced-motion *, …`) so the playground app can opt in.
   - Or move the rule to `apps/web/` only and add a runtime opt-out attribute on `<html>` while the user is on `/theme-generator` (so the editor scene shows real timings).

2. **Add a runtime `data-motion-preview` attribute** that the theme generator sets on `<html>` while live-editing motion tokens. The reduced-motion rule's selector becomes `html:not([data-motion-preview]) *, …` so generator preview wins over the OS hint while the editor is open.

Recommended: **option 2** — preserves the lib's a11y posture for end-consumer apps while making the generator usable.

### AC-2 — Typography sizes MUTE-RISK

**Failing test asserts:** mutating `--text-base` on `:root` (or `--font-size-base`,
whatever the bridge expects) and rendering an element with `class="text-base"`
yields `getComputedStyle(el).fontSize === "<new-value>"`.

**Smallest fix candidates:**

1. **Add `--text-*` to lib's `@theme inline`** in `packages/ui/src/styles/theme.css`:
   ```css
   @theme inline {
     ...
     --text-xs:   var(--text-xs);
     --text-sm:   var(--text-sm);
     --text-base: var(--text-base);
     --text-lg:   var(--text-lg);
     --text-xl:   var(--text-xl);
     --text-2xl:  var(--text-2xl);
     --text-3xl:  var(--text-3xl);
   }
   ```
   This re-declares the Tailwind v4 typography namespace so runtime overrides on `:root --text-base` flow through to the `text-base` utility.

2. Verify lib's `tokens.css` ships sane defaults if no override is provided (currently the lib only ships size *tokens* via the consumer — the lib defaults probably need explicit declarations).

Expected outcome: test goes from RED to GREEN with fix #1 alone.

### AC-3 — Nav-on-dark gradient hard-codes literals

**Failing test asserts:** mutating `--nav-on-dark-accent-strong` and rendering
`<NavItem tone="onDark" active>…</NavItem>` produces a `background-image`
gradient that mixes the new token color (asserted by parsing the gradient
declaration string).

**Smallest fix candidates:**

1. Replace the rgba literals in `packages/ui/src/components/nav-item/nav-item.variants.ts`:
   ```ts
   // before
   'aria-[current=page]:bg-[linear-gradient(135deg,rgba(213,168,69,0.22),rgba(122,57,128,0.12))]'
   // after — token-driven via color-mix
   'aria-[current=page]:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--nav-on-dark-accent)_22%,transparent),color-mix(in_oklab,var(--nav-on-dark-accent-strong)_12%,transparent))]'
   ```
   Mirrors the same recipe Chip/Toast/Hint use for tinted surfaces.

### AC-4 — Chart tokens — regression guard

**Failing test asserts:** mutating `--chart-1` on `:root` and rendering an
element with `class="bg-chart-1"` yields the matching computed background-color.

**Source state today:** the lib *already* bridges `--color-chart-1..5: var(--chart-1..5)`
in `packages/ui/src/styles/theme.css`. This AC is therefore likely a
**regression-guard add-only**, not a real fix. The test should pass on first
run; if it fails, the fix is to add the missing `@theme inline` entry.

### AC-5 — App pattern E2E

**Failing test asserts:** in `/theme-generator`, edit `app-pattern.size` from
default to a different value, then assert the rendered pattern surface in the
preview pane has the new computed size (via DOM attribute or computed style).

**Smallest fix candidates:**

1. Verify `apps/web/app/styles/patterns.css` reads `var(--app-pattern-size)` for sizing and `var(--app-pattern-color-1..3)` for colors.
2. If yes, the E2E test is purely a regression guard.
3. If no, wire the patterns.css to read those vars (it currently might use literal pixel sizes).

## Order of work (auto mode)

1. AC-1 first (URGENT — confirmed defect).
2. AC-2 second (verifies suspected mute; cheap to write, settles the question).
3. AC-3, AC-4, AC-5 in parallel-but-sequential PR cycle — each ~30 min of work.

## Definition of Done (per AC)

- [ ] Failing test added in the path above.
- [ ] Test fails for the *right reason* (assert before fix, capture failure message in PR description).
- [ ] Implementation fix applied per checklist; test goes GREEN.
- [ ] Full lib suite (`pnpm --filter @damo/ui test`) stays green.
- [ ] Code review (`code-reviewer` agent) APPROVE.
- [ ] PR opened + merged with `--merge --delete-branch`.
- [ ] Trace matrix updated (move journey from NONE/PARTIAL → FULL).

## Notes / risks

- **AC-1 reduced-motion fix is policy-sensitive.** The current rule is correct
  a11y behavior for production consumer apps. The right fix is to *scope* it,
  not remove it. Document the chosen scope in the PR.
- **AC-3 has cross-component impact.** DropdownMenuRadioItem mirrors NavItem's
  selection chrome (per `core-knowledge/`). After AC-3 fix, also verify
  DropdownMenuRadioItem's tinted gradient — may be the same hard-coded
  literal pattern.
- **AC-5 (E2E) is the slowest test.** Defer if Playwright runtime is
  expensive in this branch; otherwise the regression value is high.
