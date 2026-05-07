---
stepsCompleted: ['step-01-load-context', 'step-02-discover-tests', 'step-03-map-criteria', 'step-04-analyze-gaps', 'step-05-gate-decision']
lastStep: 'step-05-gate-decision'
lastSaved: '2026-05-07'
tempCoverageMatrixPath: '/tmp/tea-trace-coverage-matrix-2026-05-07T22-42-07.json'
gateDecision: 'FAIL'
coverageBasis: 'synthetic_requirements'
oracleConfidence: 'high'
oracleResolutionMode: 'synthetic_source'
oracleSources:
  - apps/web/app/theme-generator/theme-state.ts
  - apps/web/app/theme-generator/use-theme-state.ts
  - apps/web/app/theme-generator/page.tsx
  - apps/web/app/styles/theme.css
  - packages/ui/src/styles/theme.css
  - packages/ui/src/styles/tokens.css
  - packages/ui/tailwind.preset.ts
  - core-knowledge/10-library/10-components/*.md
externalPointerStatus: 'not_used'
defectContext: 'theme-generator motion durations BASE/SLOW edits do not visibly affect Accordion / Progress in the preview pane'
---

# Theme Generator → Component Propagation — Traceability Matrix

**Owner:** Murat (TEA) · **Project:** damo-ui · **Date:** 2026-05-07
**Defect under investigation:** Editing `theme.motion.<mode>.durations.{base,slow}` in
`/theme-generator` produces no visible effect on the consumer components in the
preview pane. Same pattern is suspected for other token groups — request scope is
*scrupulous audit of every customizable variable*.

---

## Step 1 — Coverage Oracle & Knowledge Load

### Oracle resolution

No formal PRD exists for the theme generator's contract. The strongest oracle
available is the **TypeScript `Theme` type** in
`apps/web/app/theme-generator/theme-state.ts`, which exhaustively lists every
customizable token, paired with the **DOM-sync function** `applyThemeToRoot()`
in `use-theme-state.ts` (the actual runtime contract) and the **lib's Tailwind
v4 bridge** in `packages/ui/src/styles/theme.css` (the consumer half).

Coverage basis: **synthetic_requirements** (high confidence). Each
generator-editable token is treated as an implicit acceptance criterion:
*"editing token X must produce a visible change on every component that uses X"*.

### Token inventory (per-mode, light + dark unless stated)

| Group                     | Editable tokens                                                            | Count (per mode) |
|---------------------------|----------------------------------------------------------------------------|------------------|
| Raw palette · ink         | 100, 300, 500, 700, 800, 900                                              | 6                |
| Raw palette · brand       | 100, 200, 300, 400, 500                                                   | 5                |
| Raw palette · paper       | 50, 100, 200, 300                                                          | 4                |
| Semantic · surfaces       | background/fg, card/fg, popover/fg, muted/fg                              | 8                |
| Semantic · intents        | primary/fg, secondary/fg, destructive/fg                                   | 6                |
| Semantic · status         | success/fg, warning/fg, info/fg                                            | 6                |
| Semantic · chrome         | border, borderStrong, ring                                                 | 3                |
| Semantic · memphis        | memphisShadowColor, memphisBorderColor                                     | 2                |
| Semantic · badge          | badgeFeatured, badgeFeaturedForeground                                     | 2                |
| Identity · medals         | bronze/silver/gold/master/grandmaster × {outer,inner,text}                 | 15               |
| Identity · charts         | chart-1 … chart-5                                                          | 5                |
| Identity · nav-on-dark    | accent, accentStrong, foreground, foregroundStrong                         | 4                |
| Identity · app pattern    | color1, color2, color3, size                                               | 4                |
| Foundation · typography   | fontDisplay, fontBody, fontMono                                            | 3                |
| Foundation · type sizes   | xs, sm, base, lg, xl, 2xl, 3xl                                             | 7                |
| Foundation · radius       | none, sm, md, selection, pill, full                                        | 6                |
| Foundation · shadowMemphis| sm, card, md, lg, hover, active × {x, y, color}                            | 18               |
| Foundation · shadowSoft   | md (single opacity scalar)                                                 | 1                |
| Foundation · motion dur.  | snap, fast, base, slow                                                     | 4                |
| Foundation · motion ease  | memphis, out                                                               | 2                |
| **TOTAL per mode**        |                                                                            | **111**          |
| **TOTAL across modes**    | (light + dark editable independently)                                      | **222**          |

### Provisional journeys (J-01 … J-13)

Grouped by token category for trace-matrix legibility. All P1 (visual integrity,
no security/data implications, but high reputational impact for a design-system
deliverable that depends on the theme generator landing right).

| ID    | Journey (every check happens for both light & dark mode)                        | Priority |
|-------|---------------------------------------------------------------------------------|----------|
| J-01  | Raw palette → semantic re-derivation (preset switch + per-step edit)            | P1       |
| J-02  | Semantic surfaces → background/foreground/card/popover/muted utilities          | P1       |
| J-03  | Semantic intents → primary/secondary/destructive utilities                      | P1       |
| J-04  | Semantic status → success/warning/info utilities                                | P1       |
| J-05  | Semantic chrome → border, border-strong, ring                                   | P1       |
| J-06  | Memphis identity → memphis-border-color + memphis-shadow-color (+ tinted recipes)| P1      |
| J-07  | Identity medals → Medal component visual                                        | P1       |
| J-08  | Identity charts + nav-on-dark + app pattern → consumer surfaces                 | P1       |
| J-09  | Typography fonts → font-display / font-body / font-mono utilities               | P1       |
| J-10  | Typography sizes → text-xs … text-3xl utilities                                 | P1       |
| J-11  | Radius → rounded-none/sm/md/selection/pill/full                                 | P1       |
| J-12  | Shadow Memphis (6 tiers × {x,y,color}) → shadow-memphis* utilities              | P1       |
| J-13  | Motion durations + easings → duration-* and ease-* utilities **[DEFECT here]**  | P1       |

### Knowledge fragments loaded

- `test-priorities-matrix.md` — P0/P1/P2/P3 criteria & coverage targets
- `risk-governance.md` — gate decision rules (PASS/CONCERNS/FAIL/WAIVED)
- `probability-impact.md` — 3×3 risk scoring scale
- `test-quality.md` — DoD criteria for green tests
- `selective-testing.md` — tag/grep slicing (not strictly needed but useful for the resulting test plan)

### Sources catalogued

| File                                                 | Role in trace                                                       |
|------------------------------------------------------|---------------------------------------------------------------------|
| `apps/web/app/theme-generator/theme-state.ts`        | Token shape + defaults — the type-level oracle                      |
| `apps/web/app/theme-generator/use-theme-state.ts`    | DOM-sync — `applyThemeToRoot` injects `<style id="theme-generator-overrides">` |
| `apps/web/app/theme-generator/page.tsx`              | UI surface — confirms which tokens have an editor control           |
| `apps/web/app/styles/theme.css`                      | Playground theme — declares `--ink-*` / `--brand-*` / `--paper-*` palette tokens the lib's overlays expect |
| `packages/ui/src/styles/theme.css`                   | Lib bridge — `@theme inline { … }` and `@utility` blocks            |
| `packages/ui/src/styles/tokens.css`                  | Lib defaults — neutral grayscale baseline                           |
| `packages/ui/tailwind.preset.ts`                     | Legacy v3 preset shim — should mirror the v4 bridge                 |
| `core-knowledge/10-library/10-components/*.md`       | Per-component documentation — tells us WHICH classes each component consumes |
| `packages/ui/src/components/**/*.test.tsx`           | Existing component tests (current source of test coverage)          |
| `packages/ui/__tests__/package-contract.test.ts`     | New peerDependency contract test                                    |

### Step 1 verdict

Oracle resolved with high confidence. Knowledge base loaded. Sources catalogued.
**Proceed to Step 2 (discover tests).**

---

## Step 2 — Existing Test Inventory

### Tests touching the theme generator surface

| File                                                                | Level     | Coverage scope                                                            |
|---------------------------------------------------------------------|-----------|---------------------------------------------------------------------------|
| `apps/web/app/theme-generator/reducer.test.ts`                      | Unit      | Reducer state transitions per `Action`. Pure, no DOM.                     |
| `apps/web/app/theme-generator/exporters.test.ts`                    | Unit      | CSS / Tailwind / JSON serialization output strings.                       |
| `apps/web/app/theme-generator/presets.test.ts`                      | Unit      | Preset application + semantic re-derivation.                              |
| `apps/web/app/theme-generator/contrast.test.ts`                     | Unit      | WCAG ratio + AA threshold helpers.                                        |
| `apps/web/app/theme-generator/sample-dialog.test.tsx`               | Component | Sample-dialog render only.                                                |
| `e2e/tests/scenarios/theme-generator-light-dark.spec.ts`            | E2E       | Editor UI: tab switches, light/dark toggle visible, sidebar branding.    |
| `e2e/tests/scenarios/theme-generator-sample-dialog.spec.ts`         | E2E       | Editor UI: sample dialog opens / cancels / confirms.                      |
| `e2e/tests/scenarios/density-effect.spec.ts`                        | E2E       | Density attribute changes ripple via `--spacing` calc.                    |

### Tests touching consumer components (lib)

37 test files under `packages/ui/src/components/**/*.test.{ts,tsx}` plus
`packages/ui/__tests__/package-contract.test.ts` and
`packages/ui/.ladle/components.test.ts`. **All assert `className.toContain(...)`
or `className.split(' ').includes(...)` — i.e. the component renders the
correct utility class names.** None resolve those utilities to runtime CSS
values, none mutate `--<token>` and re-read computed style.

| Pattern                                                | Count | Implication                                                |
|--------------------------------------------------------|-------|------------------------------------------------------------|
| Class-string assertions                                | 37    | Proves utility is APPLIED. Does NOT prove it RESOLVES.    |
| Runtime computed-style assertions                      | 0     | **Gap.** No test catches a "muted token" regression.       |
| End-to-end token-edit → consumer-render                | 0     | **Gap.** This is exactly the user's reported defect class. |

### Coverage heuristics inventory

| Heuristic                                              | Coverage                                                |
|--------------------------------------------------------|---------------------------------------------------------|
| Token resolution (does `var(--X)` produce X's value?)  | ❌ none — neither lib nor app exercises this            |
| DOM-sync (`applyThemeToRoot` correctness)              | ❌ none — function is private, never tested directly    |
| `@utility` block resolution (e.g. `duration-base`)     | ❌ none — the lib's bridge classes have no integration test |
| Reduced-motion override path                           | ❌ none — `@media (prefers-reduced-motion: reduce)` in app theme.css would override every motion utility, untested |
| Light↔Dark mode parity                                 | ⚠️ partial — light/dark toggle tested at UI level, not at computed-style level |
| Preset switch → semantic re-derivation                 | ✅ unit-level (`presets.test.ts`) — but no DOM integration |
| Editor UI surface (controls visible, modes switch)     | ✅ E2E (`theme-generator-light-dark.spec.ts`)           |

### Test-level taxonomy

```
Unit (61):
  ├── theme-generator/{reducer,exporters,presets,contrast}.test.ts (4)
  ├── packages/ui/src/components/**/*.test.tsx — pure render assertions (≈40)
  ├── packages/ui/src/hooks/*.test.ts (2)
  ├── packages/ui/src/lib/cn.test.ts (1)
  ├── packages/ui/src/styles/__tests__/contrast-utils.test.ts (1)
  ├── packages/ui/src/components/pagination/pagination-math.test.ts (1)
  ├── packages/ui/src/mocks/*/*.test.tsx (5)
  └── packages/ui/__tests__/package-contract.test.ts + .ladle/components.test.ts (2)

Component (1):
  └── apps/web/app/theme-generator/sample-dialog.test.tsx

E2E (10+):
  ├── e2e/tests/scenarios/theme-generator-{light-dark,sample-dialog}.spec.ts (2)
  ├── density-effect.spec.ts (1) — closest analog to a token→effect E2E
  └── … (smoke, navbar, docs)

Integration (token edit → component computed style):  0
```

### Step 2 verdict

Existing tests cover the EDITOR (E2E) and the COMPONENTS (unit class-string),
but **the integration layer between them — token edit triggering a real
visible change — is not covered**. This is precisely the defect surface
the user is reporting. The trace must explicitly map every token to (a) the
DOM target, (b) the consumer class, (c) which existing test layer covers
that link, and (d) the gap.

**Proceed to Step 3 (map criteria → tests).**

---

## Step 3 — Trace Matrix (Journeys × Tests × Coverage)

### Coverage labels

| Label              | Meaning                                                                                       |
|--------------------|-----------------------------------------------------------------------------------------------|
| **FULL**           | DOM-sync ✅ + Bridge ✅ + Class applied ✅ + Computed-style asserted ✅                        |
| **PARTIAL-CLASS**  | DOM-sync ✅ + Bridge ✅ + Class applied ✅ but computed-style NOT asserted                    |
| **PARTIAL-UNIT**   | Reducer/exporter unit tests cover the data plane only; no DOM/runtime check                   |
| **NONE**           | No test asserts the link at any layer                                                         |
| **MUTE-RISK**      | DOM-sync writes a var but the lib bridge does not declare a corresponding `@theme` namespace, so the runtime override may silently fail |
| **DEFECT**         | Confirmed regression — link does not work at runtime                                           |

### Master matrix — by journey

Each journey is checked at four layers:

```
Layer A: DOM-sync writes the right --var-name (data plane)
Layer B: Lib's @theme inline / @utility maps the var to a Tailwind utility
Layer C: Consumer component applies the right utility class
Layer D: Runtime computed-style on a rendered component reflects the edited value
```

| ID    | Journey                                       | Layer A    | Layer B    | Layer C    | Layer D | Coverage      | Existing tests                                                                          |
|-------|-----------------------------------------------|------------|------------|------------|---------|---------------|-----------------------------------------------------------------------------------------|
| J-01  | Raw palette → semantic re-derivation          | ✅          | n/a (consumer-territory) | ✅ (via `var(--ink-*)` direct) | ❌      | PARTIAL-UNIT  | `presets.test.ts`, `reducer.test.ts`                                                    |
| J-02  | Semantic surfaces                              | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | 37 component tests assert classes; no computed-color test                               |
| J-03  | Semantic intents                               | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | same                                                                                    |
| J-04  | Semantic status                                | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | same (Banner/Toast tint variants)                                                       |
| J-05  | Semantic chrome (border, ring)                 | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | same                                                                                    |
| J-06  | Memphis identity (border + shadow color)       | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | + per-instance `[--memphis-shadow-color:var(--X)]` recipe untested at runtime           |
| J-07  | Identity medals                                | ✅          | ✅ (direct `var()` in Medal SVG) | ✅ | ❌      | PARTIAL-CLASS | `medal.test.tsx` (12 tests, render-only)                                                |
| J-08a | Charts                                         | ✅          | ✅          | ⚠️ rare   | ❌      | NONE          | Charts color used by consumers, no in-lib component                                     |
| J-08b | Nav-on-dark                                    | ✅          | ❌ (no `@theme` bridge — used via arbitrary value `[var(--nav-on-dark-*)]`) | ⚠️ partial — gradient hard-codes gold/plum literals | ❌ | NONE | NavItem onDark tone partially ignores tokens (documented bug) |
| J-08c | App pattern (`--app-pattern-*`)                | ✅          | n/a (consumer CSS) | ✅ (apps/web/app/styles/patterns.css) | ❌ | NONE | No coverage of pattern rendering                                                        |
| J-09  | Typography fonts                               | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | no font-family computed assertion                                                       |
| J-10  | Typography sizes                               | ✅          | ⚠️ **MUTE-RISK** — lib's theme.css has NO `--text-*` in `@theme inline`. Tailwind v4 default `--text-*` scale wins unless the consumer's stylesheet redeclares them in `@theme`. | ✅ | ❌ | **MUTE-RISK** | none                                                                                    |
| J-11  | Radius                                         | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS |                                                                                         |
| J-12  | Shadow Memphis (6 tiers × {x,y,color})         | ✅          | ✅          | ✅          | ❌      | PARTIAL-CLASS | exporters.test for output string only                                                   |
| J-13a | Motion durations (snap/fast/base/slow)         | ✅          | ✅ (4× `@utility`) | ✅          | ❌      | **DEFECT**    | None — and `@media (prefers-reduced-motion: reduce)` in `apps/web/app/styles/theme.css` forces ALL `transition-duration: 0.01ms !important` regardless of generator output |
| J-13b | Motion easings (memphis/out)                   | ✅          | ✅ (`@theme inline`) | ✅      | ❌      | PARTIAL-CLASS | not affected by reduced-motion (only durations are)                                     |

### Defect root-cause hypothesis (J-13a, motion durations)

The user's symptom — "BASE=1200, SLOW=1302 has no effect" — is most likely
caused by the **reduced-motion override in `apps/web/app/styles/theme.css`**:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transform: none !important;
  }
}
```

The `!important` clause beats every `--duration-*` override the generator
emits. If the user's OS / browser has reduced motion enabled (System
Preferences → Accessibility on macOS, Settings → Ease of Access on Windows,
or via DevTools "Emulate reduced motion"), every transition collapses to
0.01ms — making generator edits look "muted". The pattern is global on
`*` and overrides the lib's `@utility duration-*` blocks because of the
`!important`.

Secondary contributing factor: the only consumers of `duration-base` and
`duration-slow` in the lib are **Accordion chevron** and **Progress fill**.
If the user's preview pane is on the `components` scene with the Accordion
collapsed, no transition is firing — visual change is invisible regardless.

### Mute-token candidates (no defect confirmed yet, but theoretical break)

| Token group         | Why it might be muted                                                                                                |
|---------------------|----------------------------------------------------------------------------------------------------------------------|
| Typography sizes    | `--text-*` not declared in lib `@theme inline`. Tailwind v4's default `--text-*` namespace value wins at build time. |
| Shadow Memphis      | Lib bridge ✅; but the `--memphis-shadow-color` per-instance override pattern relies on cascade — needs runtime test  |
| `--header-height`   | Used in CSS via `var(--header-height)` (AppTopBar / Sidebar `top-[var(--header-height)]`) — generator does NOT edit it; not a customizable token, but worth flagging |

### Step 3 verdict

- **1 confirmed DEFECT** (J-13a motion durations: reduced-motion media query overrides them).
- **1 explicit MUTE-RISK** (J-10 typography sizes, no `@theme` bridge in lib).
- **1 partial functional bug** (J-08b nav-on-dark gradient hard-codes literals — already documented in `core-knowledge`).
- **All other journeys: PARTIAL-CLASS** — class application asserted, computed-style propagation untested. Low immediate risk but no regression guard.

**Proceed to Step 4 (gap analysis).**

---

## Step 4 — Gap Analysis & Recommendations (Phase 1 complete)

### Coverage statistics

```
Total requirements (synthetic journeys): 16
Fully covered (DOM-sync ✅ + bridge ✅ + class ✅ + computed-style ✅): 0  (0%)
Partially covered: 11  (class-string assertions only)
Unit-only: 1  (J-01 reducer)
Uncovered (NONE): 4  → J-08a charts, J-08b nav-on-dark, J-08c app pattern, J-13a motion durations
Risk-flagged: 2  → J-13a DEFECT, J-10 MUTE-RISK
Priority breakdown — P1: 16/16 not fully covered. No P0 (no security/data path).
```

Coverage of the **token → consumer-component runtime propagation** is
effectively **0%** today. Class-string tests cover ~70% of the chain but stop
short of asserting the runtime resolves to the customized value.

### Heuristic gaps

| Heuristic                                            | Count | Gap                                                                       |
|------------------------------------------------------|-------|---------------------------------------------------------------------------|
| UI journeys without E2E (token→component)            | 4     | J-13a motion (Accordion + Progress), J-08b nav-on-dark, J-10 typography  |
| UI states missing coverage                            | 1     | J-13a reduced-motion override path — what's the contract?                |
| Endpoint coverage / auth / error path                 | 0     | Not applicable (UI-only audit)                                           |

### Recommendations (ordered by impact)

| Severity   | Action                                                                                                                                   | Items                                |
|------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| **URGENT** | **Fix J-13a motion DEFECT.** Decide policy on `prefers-reduced-motion`: scope the rule (don't apply to *all* via `*` selector) so generator edits are visible during preview. Alternative: gate it behind a user-controllable toggle. | J-13a                                |
| **HIGH**   | Run `/bmad:tea:atdd` (`AT`) for the 4 NONE-coverage journeys — generate failing acceptance tests + implementation checklist.            | J-08a, J-08b, J-08c, J-13a           |
| **HIGH**   | Verify J-10 with a runtime test: mutate `--text-base`, render component using `text-base`, assert computed `font-size`. If muted, add `--text-*` to lib `@theme inline`. | J-10                                 |
| **HIGH**   | Run `/bmad:tea:automate` (`TA`) to expand 11 PARTIAL journeys with computed-style assertions. Standard pattern: render → mutate `:root --X` → re-read `getComputedStyle(node).Y`. | J-02..J-07, J-09, J-11, J-12, J-13b  |
| **MEDIUM** | Promote these 16 inferred journeys to formal acceptance criteria. Theme generator's "every editable token affects its consumer" is the de-facto product contract. | All                                  |
| **LOW**    | Run `/bmad:tea:test-review` (`RV`) on the 37-file lib component test suite. Class-string is necessary but not sufficient.               | —                                    |

### Defect deep-dive — J-13a (motion durations)

Most-likely root cause hierarchy (descending probability):

1. **`@media (prefers-reduced-motion: reduce)` global override.** Located at the bottom of `apps/web/app/styles/theme.css`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
       transform: none !important;
     }
   }
   ```
   The `!important` + universal `*` selector beats every `@utility duration-*` block from the lib, regardless of the runtime variable value. If the user's OS / browser has reduced motion enabled (DevTools "Emulate CSS prefers-reduced-motion" included), motion edits are silently overridden.

2. **Preview-pane scene without an actively-animating consumer.** The components-preview scene includes `<Accordion>` and `<Progress>`, but if Accordion is collapsed and Progress is at a static value, no transition fires — visual change is invisible regardless of the duration.

3. **Browser caching of the previous override stylesheet.** `applyThemeToRoot` writes to a single `<style id="theme-generator-overrides">`; in practice React updates re-write the textContent. Unlikely to be the issue but worth ruling out.

### Phase 1 deliverable

- **Markdown report**: `_bmad-output/test-artifacts/traceability/traceability-matrix.md` (this file).
- **JSON coverage matrix**: `/tmp/tea-trace-coverage-matrix-2026-05-07T22-42-07.json` (Phase 2 input).

### Phase 1 summary

```
✅ Phase 1 Complete: Coverage Matrix Generated

📊 Coverage Statistics
- Total Requirements: 16
- Fully Covered: 0 (0%)
- Partially Covered: 11
- Unit-Only: 1
- Uncovered: 4

🎯 Priority Coverage
- P0: n/a (no P0 items)
- P1: 0/16 (0%) full · 11/16 partial · 4/16 none

⚠️ Gaps Identified
- HIGH (P1): 4 NONE coverage  · 1 confirmed DEFECT (J-13a) · 1 MUTE-RISK (J-10)
- All P1 partials lack runtime computed-style coverage

🔍 Coverage Heuristics
- UI journey gaps: 4
- UI state gaps: 1 (reduced-motion path)

📝 Recommendations: 6 (1 URGENT + 4 HIGH + 1 LOW)

🔄 Phase 2: Gate decision (next step)
```

**Proceed to Phase 2 — Step 5 (gate decision).**

---

## Step 5 — Gate Decision (Phase 2)

### Decision logic applied

```
Rule 1: P0 coverage = 100%? → MET (vacuously: no P0 items)
Rule 2: Overall coverage ≥ 80%? → NOT MET (0%)            ← stops here
Result: FAIL
```

### Gate verdict

```
🚫 GATE: FAIL — Theme-generator runtime-propagation coverage does not meet
   minimum threshold for a release-candidate.

📊 Coverage Analysis
- P0 Coverage:      n/a / 0  → MET (no P0 items in scope)
- P1 Coverage:        0 / 16 (0%)   target 90% / floor 80%   → NOT_MET
- Overall:            0 / 16 (0%)   floor 80%                → NOT_MET

✅ Decision Rationale
Of 16 synthetic P1 journeys covering every customizable token group in
the theme generator, ZERO are fully covered with runtime computed-style
assertions. Class-string assertions (37 component test files) provide
~70% partial coverage but none of them prove a token edit visibly
propagates. 1 confirmed DEFECT (J-13a motion durations, blocked by the
global `prefers-reduced-motion` override in apps/web/app/styles/theme.css)
and 1 MUTE-RISK (J-10 typography sizes, no `@theme` bridge in lib).

⚠️ High-priority gaps: 4
   J-08a Charts          — no in-lib consumer
   J-08b Nav-on-dark     — NavItem onDark gradient hard-codes literals
   J-08c App pattern     — no consumer-side regression coverage
   J-13a Motion durs.    — DEFECT confirmed

📝 Recommended Actions (top 3)
1. URGENT — Fix J-13a motion DEFECT. Scope or gate the
   prefers-reduced-motion override so generator edits remain visible.
2. HIGH — Run /bmad:tea:atdd for the 4 NONE-coverage journeys.
3. HIGH — Verify J-10 with a runtime computed-style test; if muted,
   add `--text-*` to lib's `@theme inline`.
```

### Artifacts produced

| File                                                                                       | Purpose                              |
|--------------------------------------------------------------------------------------------|--------------------------------------|
| `_bmad-output/test-artifacts/traceability/traceability-matrix.md`                          | Human-readable trace + gate report   |
| `_bmad-output/test-artifacts/traceability/e2e-trace-summary.json`                          | Machine-readable summary (CI/dashboards) |
| `_bmad-output/test-artifacts/traceability/gate-decision.json`                              | Gate-only signal (slim)              |
| `/tmp/tea-trace-coverage-matrix-2026-05-07T22-42-07.json`                                  | Phase 1 coverage matrix (Phase 2 input) |

### Workflow complete

Trace + gate done. The recommended next BMad step is **`AT` — ATDD**
(`bmad-testarch-atdd`) for the 4 NONE-coverage P1 journeys. This will
generate failing acceptance tests and an implementation checklist that
the dev cycle can drive to green.
