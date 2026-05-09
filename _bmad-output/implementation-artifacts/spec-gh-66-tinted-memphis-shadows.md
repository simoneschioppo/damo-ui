# spec-gh-66 — Restore per-instance Memphis tinted-shadow recipe via per-color @utility blocks

**Issue:** [#66](https://github.com/simoneschioppo/damo-ui/issues/66)
**Branch:** `fix/gh-66-tinted-memphis-shadows`
**Status:** FROZEN-AFTER-APPROVAL — no body edits during implementation
**Closes:** #66 (and the Caveat from #58 / PR #65)

---

## Intent

Replace the broken per-instance recipe `[--memphis-shadow-color:var(--X)] shadow-memphis` (which renders black at runtime — see PR #65 caveat) with a small set of per-color `@utility` blocks that bake the intent token into the `box-shadow` declaration. This restores the lib's signature "tinted Memphis shadow" affordance on Button ghost, focused inputs, validation states, Toast variants, Banner variants, Dialog danger, and FeatureCard / Card featured.

## Why path B (per-color `@utility` blocks)

Two empirical findings drive the choice:

1. **The browser substitutes `var()` references inside an inherited custom property at the _declaring_ element.** With `--shadow-memphis: 6px 6px 0 var(--memphis-shadow-color)` declared at `:root`, the inner `var(--memphis-shadow-color)` resolves to the literal `#000000` at `:root` and inherits as that literal. A consumer redeclaring `--memphis-shadow-color: var(--primary)` cannot retroactively re-tint the already-resolved `--shadow-memphis`. Verified in PR #65 against a no-Tailwind repro across Chromium and WebKit.

2. **Tailwind v4 _does_ generate `@utility shadow-memphis-{intent} { box-shadow: 6px 6px 0 var(--<intent>); }` blocks.** Reproduced this PR by adding two such utilities to `theme.css` + a marker reference in source + `pnpm --filter @damo/web build` — both `.shadow-memphis-primary` and `.shadow-memphis-success` rules appear in `.next/static/css/*.css` exactly as authored. The earlier "silently dropped" claim in #66's comment was incorrect (the abandoned attempt likely missed a build/copy step; the architectural approach is sound).

Path B avoids the substitution-time trap because each utility's `box-shadow` declaration is itself the `var(--<intent>)` consumer — substitution happens at the painted element's computed-value time, against the cascade visible to that element.

## Boundaries

### In-scope

- Add per-color `@utility shadow-memphis-{primary,success,warning,destructive,info}` blocks (md tier, 6px 6px 0 offset).
- Add `@utility shadow-memphis-lg-destructive` (lg tier, 9px 9px 0 offset) for Dialog danger.
- Migrate every consumer of the legacy `[--memphis-shadow-color:var(--X)] shadow-memphis` recipe to the matching per-color utility:
  - `Button` ghost variant
  - `Input` focus + invalid
  - `Textarea` focus + invalid
  - `Select` trigger focus
  - `Combobox` trigger focus
  - `DatePicker` trigger focus
  - `Toast` success / warning / danger variants
  - `Banner` info / success / warning / danger variants
  - `Dialog` content `tone="danger"`
  - `Card` featured variant (FeatureCard inherits from this)
- Update source-contract tests in `theme-bridge-coverage.test.ts` to assert the new classes (replacing the raw `[--memphis-shadow-color:…]` fragment assertions).
- Add new `J-12b` describe block asserting each per-color `@utility`'s declaration in `theme.css`.
- Add an e2e regression guard that:
  - Edits `--primary` to a recognizable color via the theme generator (or directly via the `<html data-palette>` overrides on `/`).
  - Renders Button ghost on `/`.
  - Reads `getComputedStyle(btn).boxShadow` and asserts the tinted color is the new `--primary`, not black.

### Out-of-scope

- Theme generator support for editing the per-color shadow offsets (`6px 6px 0` / `9px 9px 0` are hardcoded in the `@utility` body — the existing `--shadow-memphis-*` token's offset override does **not** propagate to per-color utilities). Documented as a follow-up in this spec; no consumer currently relies on offset overrides for the tinted recipe (the broken one couldn't carry offset edits either).
- Adding per-color utilities for unused intents (no consumer currently uses md×secondary).
- Adding per-color utilities for unused tiers (only lg×destructive is consumed; sm/card/hover/active × intent are not, and we follow the project rule "don't add features beyond what the task requires").
- Cleaning up the existing `--memphis-shadow-color` token. It still appears in `tokens.css` and `@theme inline` because the `border-memphis` / shadow-memphis (default black) utilities continue to read it; only the broken per-instance override pattern goes away.

## I/O matrix

| Component                        | Old class fragment                                                                     | New class                                                                                     | Tier | Color           |
| -------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---- | --------------- |
| `Button` ghost                   | `[--memphis-shadow-color:var(--primary)] shadow-memphis`                               | `shadow-memphis-primary`                                                                      | md   | `--primary`     |
| `Input` focus                    | `focus-visible:[--memphis-shadow-color:var(--primary)] focus-visible:shadow-memphis`   | `focus-visible:shadow-memphis-primary`                                                        | md   | `--primary`     |
| `Input` invalid                  | `aria-invalid:[--memphis-shadow-color:var(--destructive)] aria-invalid:shadow-memphis` | `aria-invalid:shadow-memphis-destructive`                                                     | md   | `--destructive` |
| `Textarea` focus                 | (mirror of Input)                                                                      | `focus-visible:shadow-memphis-primary`                                                        | md   | `--primary`     |
| `Textarea` invalid               | (mirror of Input)                                                                      | `aria-invalid:shadow-memphis-destructive`                                                     | md   | `--destructive` |
| `Select` trigger focus           | `focus-visible:[--memphis-shadow-color:var(--primary)] focus-visible:shadow-memphis`   | `focus-visible:shadow-memphis-primary`                                                        | md   | `--primary`     |
| `Combobox` trigger focus         | (same as Select)                                                                       | `focus-visible:shadow-memphis-primary`                                                        | md   | `--primary`     |
| `DatePicker` trigger focus       | (same as Select)                                                                       | `focus-visible:shadow-memphis-primary`                                                        | md   | `--primary`     |
| `Toast` success                  | base `shadow-memphis` + `[--memphis-shadow-color:var(--success)]`                      | base loses `shadow-memphis`; variant gains `shadow-memphis-success`                           | md   | `--success`     |
| `Toast` warning                  | (analogous)                                                                            | variant gains `shadow-memphis-warning`                                                        | md   | `--warning`     |
| `Toast` danger                   | (analogous)                                                                            | variant gains `shadow-memphis-destructive`                                                    | md   | `--destructive` |
| `Toast` default                  | base `shadow-memphis` (no per-instance override)                                       | variant gains `shadow-memphis`                                                                | md   | (default black) |
| `Banner` info                    | base `shadow-memphis` + `[--memphis-shadow-color:var(--info)]`                         | base loses `shadow-memphis`; variant gains `shadow-memphis-info`                              | md   | `--info`        |
| `Banner` success                 | (analogous)                                                                            | variant gains `shadow-memphis-success`                                                        | md   | `--success`     |
| `Banner` warning                 | (analogous)                                                                            | variant gains `shadow-memphis-warning`                                                        | md   | `--warning`     |
| `Banner` danger                  | (analogous)                                                                            | variant gains `shadow-memphis-destructive`                                                    | md   | `--destructive` |
| `Dialog` content `tone="danger"` | base `shadow-memphis-lg` + conditional `[--memphis-shadow-color:var(--destructive)]`   | conditional swap: `tone === 'danger' ? 'shadow-memphis-lg-destructive' : 'shadow-memphis-lg'` | lg   | `--destructive` |
| `Card` featured                  | `[--memphis-shadow-color:var(--primary)]` + `shadow-memphis`                           | `shadow-memphis-primary` (replaces both)                                                      | md   | `--primary`     |

`FeatureCard` consumes `Card variant="featured"`, so it inherits the migration automatically.

## Code map

### New `@utility` blocks (in `packages/ui/src/styles/theme.css`)

```css
/* Per-color tinted Memphis shadows. The legacy
 * `[--memphis-shadow-color:var(--X)] shadow-memphis` recipe relied on
 * per-instance custom-property override flowing into an inherited
 * `--shadow-memphis: 6px 6px 0 var(--memphis-shadow-color)` token, but
 * browsers substitute the inner var() at the declaring element (`:root`),
 * not the consumer — so the painted shadow stayed black regardless.
 * Each utility below bakes the intent token into the box-shadow itself,
 * so substitution happens at the consumer element's computed-value time.
 * See #66, PR #65 caveat. */
@utility shadow-memphis-primary {
  box-shadow: 6px 6px 0 var(--primary);
}
@utility shadow-memphis-success {
  box-shadow: 6px 6px 0 var(--success);
}
@utility shadow-memphis-warning {
  box-shadow: 6px 6px 0 var(--warning);
}
@utility shadow-memphis-destructive {
  box-shadow: 6px 6px 0 var(--destructive);
}
@utility shadow-memphis-info {
  box-shadow: 6px 6px 0 var(--info);
}
@utility shadow-memphis-lg-destructive {
  box-shadow: 9px 9px 0 var(--destructive);
}
```

### Test files

- `packages/ui/src/styles/__tests__/theme-bridge-coverage.test.ts` — extend `J-12` block + add `J-12b` per-color block; rewrite the per-instance-recipe consumers list to assert the new classes.
- `e2e/tests/scenarios/tinted-memphis-shadow-runtime.spec.ts` — new file; runtime guard via `getComputedStyle(...).boxShadow` on Button ghost (primary) and Toast danger (destructive) on `/`.

### Component files (migrate consumers)

- `packages/ui/src/components/button/button.variants.ts`
- `packages/ui/src/components/input/input.tsx`
- `packages/ui/src/components/textarea/textarea.tsx`
- `packages/ui/src/components/select/select.tsx`
- `packages/ui/src/components/combobox/combobox.tsx`
- `packages/ui/src/components/date-picker/date-picker.tsx`
- `packages/ui/src/components/toast/toast.tsx`
- `packages/ui/src/components/banner/banner.variants.ts`
- `packages/ui/src/components/dialog/dialog.tsx`
- `packages/ui/src/components/card/card.variants.ts`

`feature-card.tsx` is unchanged: it consumes `Card variant="featured"`, which migrates upstream.

## Tasks

1. **Empirical reproduction** (✅ done) — confirm `@utility shadow-memphis-{intent}` blocks generate via apps/web build.
2. **TDD: failing source-contract tests** — extend `theme-bridge-coverage.test.ts`:
   - Add `J-12b` describe block asserting each per-color `@utility`'s declaration regex.
   - Rewrite the per-instance-recipe sub-block: instead of asserting the raw `[--memphis-shadow-color:…]` fragment in each consumer, assert the new `shadow-memphis-{intent}` class.
3. **TDD: failing e2e** — write `e2e/tests/scenarios/tinted-memphis-shadow-runtime.spec.ts` with at least two scenarios: Button ghost (primary tint) and Toast danger (destructive tint).
4. **Implement utilities** — append the six `@utility` blocks to `packages/ui/src/styles/theme.css`. Run `pnpm --filter @damo/ui run build:css`.
5. **Migrate consumers** — apply the I/O matrix substitutions across the 10 component files, removing `[--memphis-shadow-color:…]` brackets and `shadow-memphis` from variant bases where it's been pushed into per-variant classes.
6. **Run quality gates** — `pnpm --filter @damo/ui test`, `pnpm --filter @damo/web test`, `pnpm --filter @damo/ui run lint`, `pnpm --filter @damo/web run lint`, `pnpm --filter @damo/ui run typecheck`, `pnpm --filter @damo/web run typecheck`.
7. **Multi-agent code review** — three rounds (code-reviewer, security-reviewer, edge-case-hunter) on the diff. Fix HIGH/CRITICAL findings even if out-of-scope.
8. **Run e2e** — `cd e2e && pnpm exec playwright test --project=chromium`. New tinted-shadow spec must pass; no regressions on existing specs.
9. **Kipi handshake** — queue paths into `_bmad/agents/kipi/workflow-state.json` `workflows.update.queued[]`.
10. **Open PR**, stop before merge for user's final review.

## Acceptance criteria

- AC-1 (source contract — utilities): each of the six new `@utility` blocks is declared in `packages/ui/src/styles/theme.css` with the correct token reference. Asserted by `J-12b` regex tests.
- AC-2 (source contract — consumers): each consumer file in the I/O matrix uses the new `shadow-memphis-{intent}` (or `shadow-memphis-lg-destructive`) class, and no longer contains the legacy `[--memphis-shadow-color:var(--X)]` per-instance fragment for the migrated path. Asserted by per-component source contains/not-contains in the J-12 sub-block.
- AC-3 (runtime — primary tint): on `/`, Button ghost's painted box-shadow contains the rgb of the active `--primary` color, not the lib's default black. Asserted by `tinted-memphis-shadow-runtime.spec.ts`.
- AC-4 (runtime — destructive tint): on a page rendering Toast danger (or via the docs Toast preview), the painted box-shadow contains the rgb of `--destructive`. Asserted by the same e2e spec.
- AC-5 (no regression — default shadow): consumers that previously used the bare `shadow-memphis` (Button primary/secondary, Card default, Toast default, etc.) keep painting the default `--memphis-shadow-color` (black, by tokens.css default). Asserted by an existing `getComputedStyle(...).boxShadow` line in the existing runtime-propagation spec, plus visual smoke.
- AC-6 (typecheck/build/test/lint clean): all gates green.

## Design notes

### Naming convention

- md tier (most common): `shadow-memphis-{intent}` — mirrors the existing `shadow-memphis` (which is md-tier, no suffix).
- non-md tier: `shadow-memphis-{tier}-{intent}` — mirrors the existing `shadow-memphis-{tier}` family.

Only one non-md tier (`lg-destructive`) is needed for now. Adding more on demand keeps the surface focused.

### Mutual exclusion in cva variants

For `Toast`, `Banner`, and `Dialog`, each variant's tinted class replaces the base's `shadow-memphis` instead of stacking on top of it. This avoids both `shadow-memphis` and `shadow-memphis-{intent}` being emitted on the same element (which would let CSS source order or `tailwind-merge` decide, neither of which is robust for custom utilities `tailwind-merge` doesn't know about).

For non-cva consumers (`Input` focus/invalid, etc.), the tinted class is gated by a state pseudo-class (`focus-visible:`, `aria-invalid:`), so the plain `shadow-memphis` only appears on different states — no overlap.

### Theme-generator interaction

The theme generator's `--shadow-memphis-{tier}` literal-value overrides (e.g. `--shadow-memphis: 7px 7px 0 #ff0000`) flow into the bare `shadow-memphis-{tier}` utilities (which read `var(--shadow-memphis-{tier})`). The new per-color utilities embed the offset (`6px 6px 0` / `9px 9px 0`) and the intent token directly, so the theme generator's `--shadow-memphis-{tier}` overrides do **not** affect the tinted variants — the tinted color follows `--primary` / `--destructive` / etc. instead.

This is a deliberate decoupling: prior to this PR, the theme generator's `--shadow-memphis-{tier}` overrides also did not flow to the tinted recipe (the recipe was broken at the substitution layer). After this PR, the tinted color _does_ follow the consumer's intent token edits, which matches user intuition for Toast danger / Button ghost / etc. Offset edits on the tinted variants would require a separate `--shadow-memphis-offset` token; deferred until at least one consumer asks.

### Why we don't add per-color blocks for unused intents/tiers

The audit identified five md-tier intents (primary/success/warning/destructive/info) and one lg-tier intent (destructive) used across the codebase. md×secondary, sm×*, card×*, hover×*, active×* tinted variants are not consumed by any component. Adding them prophylactically would inflate the utility surface and the theme.css file without addressing a real call site — out of scope per the project's "don't design for hypothetical future requirements" rule. Anyone needing a new combination can add the corresponding `@utility` block in one line.

### Tailwind-merge compatibility (post-review correction)

`tailwind-merge`'s default config does **not** know about the lib's custom `shadow-memphis-*` utilities — empirical probes (round-1 adversarial review) showed `cn('shadow-memphis-primary', 'shadow-none')` keeps both classes, and cross-tier collisions like `shadow-memphis` + `shadow-memphis-lg-destructive` collapse only by accident of source order. To restore the "consumer can opt out via `shadow-none`" contract every other shadow utility honours, `cn.ts` registers all `shadow-memphis-*` classes (including the legacy `-sm/-card/-lg/-hover/-active`) in the `shadow` conflict group via `extendTailwindMerge`. `cn.test.ts` has empirical probes for the regressions the round-1 review surfaced.

### Per-color hover/active utilities for Button ghost

The non-tinted `shadow-memphis-hover` (7px 7px 0) and `shadow-memphis-active` (2px 2px 0) read `var(--memphis-shadow-color)` (default black) at the consumer. Pre-fix, Button ghost was completely broken — rest, hover, and active all painted black. Post-fix, rest paints `--primary` but hover/active would jolt back to default black on every interaction without dedicated tinted utilities. The PR therefore also adds:

- `shadow-memphis-primary-hover` → `box-shadow: 7px 7px 0 var(--primary)`
- `shadow-memphis-primary-active` → `box-shadow: 2px 2px 0 var(--primary)`

Button ghost uses `hover:shadow-memphis-primary-hover` and `active:/data-[state=open]:shadow-memphis-primary-active`. No other consumer pairs a per-color rest shadow with hover/active offset changes, so primary is the only intent that needs hover/active variants for now.

**Roster asymmetry — latent foot-gun**: `success` / `warning` / `destructive` / `info` only have rest variants. Any new consumer that composes e.g. `shadow-memphis-destructive` with `hover:shadow-memphis-hover` would silently jolt to default black on hover — the same bug class HIGH-2 from round-1 review. The new utilities block in `theme.css` carries an inline warning so future contributors notice. Adding the missing 8 utilities preventively was rejected per the project rule "don't design for hypothetical future requirements"; the warning + this paragraph are the contract.

## Verification

- Source-contract regression suite (`pnpm --filter @damo/ui test`) — at least 6 new test cases (one per utility) must pass; the rewritten per-instance-recipe consumer assertions must pass.
- E2E (`cd e2e && pnpm exec playwright test --project=chromium`) — new `tinted-memphis-shadow-runtime.spec.ts` must pass; existing `theme-generator-token-runtime-propagation.spec.ts` and `theme-generator-comprehensive-token-audit.spec.ts` must not regress.
- Visual smoke on `/`: Button ghost paints with primary-tinted Memphis offset; Toast danger (via docs preview) paints destructive-tinted; Input focus paints primary-tinted; aria-invalid Input paints destructive-tinted.
- Visual smoke on `/theme-generator`: changing `--primary` updates Button ghost's painted shadow live (was previously stuck on black).
