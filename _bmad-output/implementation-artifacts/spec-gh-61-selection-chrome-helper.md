---
title: 'gh-61 — extract selection-chrome recipe shared by NavItem + DropdownMenuRadioItem'
type: 'refactor'
created: '2026-05-08'
baseline_commit: 'f01de89ff04b1c10020548fa1ee0a2e48d1f8d72'
status: 'in-progress'
context:
  - '{project-root}/CLAUDE.md'
  - '{project-root}/core-knowledge/10-library/10-components/nav-item.md'
  - '{project-root}/core-knowledge/10-library/10-components/dropdown-menu.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** the "selection chrome" recipe (rounded-selection radius, 135° tinted gradient via `color-mix(in oklab, …)`, 1px inset outline, absolute-positioned 3px ::before bar) is duplicated verbatim across three call-sites: `nav-item.variants.ts` (default tone), `nav-item.variants.ts` (onDark tone), and `dropdown-menu.tsx` (RadioItem). The two implementations have already drifted on the bar inset (`left-[-2px]` vs. `left-1`) and any future tweak to the recipe must be triple-applied.

**Approach:** Option **A** from the issue — a `cn`-style helper `selectionChromeClasses()` that emits the parametrized class list. The helper owns the fixed shape (gradient angle, % mixes, ::before geometry, 1px inset outline). Per call-site flexibility (gate-attr `aria-current=page` vs. `data-state=checked`; token names; bar inset) is exposed as parameters. Helper output is a `string[]` so it composes cleanly with the existing `cva` array form in `nav-item.variants.ts` and the `cn(...)` argument list in `dropdown-menu.tsx` — zero refactor of the call-site shape.

## Boundaries & Constraints

**Always:**

- Public TS interfaces of `NavItem`, `DropdownMenuRadioItem`, and the `navItemVariants` CVA recipe stay unchanged (same exports, same prop names, same variant keys).
- Visual parity: every utility class that the duplicated blocks emit today MUST still appear in the rendered className for the same gate (`aria-[current=page]:` for NavItem, `data-[state=checked]:` for the radio item). Bar inset stays `left-[-2px]` for NavItem (sidebar gutter bleed) and `left-1` for RadioItem (overflow-hidden panel).
- Existing tests (`nav-item.test.tsx`, `nav-item.tone-on-dark.test.ts`, `dropdown-menu.test.tsx`) MUST keep passing without modification — the helper is a refactor, not a behavioral change.
- The helper lives next to `cn` in `packages/ui/src/lib/` and is exported from the package barrel `packages/ui/src/index.ts` so external consumers can build their own selection-chrome surfaces (matches the lib's "shadcn-copy" philosophy).
- Helper output composes safely with `twMerge` (no rule shadowing pre-existing utilities at the call-site).

**Ask First:**

- If the helper's emitted token literals would diverge from any of the three current sites in a way that changes runtime CSS resolution (e.g. swapping a token name, changing the `color-mix` percentages), halt and surface the diff.
- If `cva`'s array variant doesn't accept a spread `string[]` from the helper without losing twMerge resolution, halt and propose either flattening to a string or adopting a `cn(...)` wrapper inside the variant.

**Never:**

- Do not edit files inside `core-knowledge/` directly — queue Kipi handshake at the end.
- Do not introduce a `<SelectionChrome>` React wrapper component (option B from the issue) — it would force a rerender boundary and disrupt the cva-driven variant pipeline.
- Do not introduce a Tailwind `@utility` block (option C from the issue) — Tailwind v4's parametrized utilities can't yet express the per-call-site token swap cleanly without a CSS preprocessor step.
- Do not unify the bar inset across the two surfaces — the `-2px` vs `1px` divergence is intentional (sidebar gutter vs. overflow-hidden panel) and called out in the core-knowledge.

## I/O & Edge-Case Matrix

| Scenario                     | Input                                                                                                                                                                                                                                                                                    | Expected Output / Behavior                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NavItem default tone         | `selectionChromeClasses({ gate: 'aria-[current=page]', accentSoft: 'var(--primary)', accentSoftMix: 18, accentStrong: 'var(--secondary)', accentStrongMix: 10, outlineToken: 'var(--primary)', outlineMix: 30, barColor: 'bg-primary', barInset: '-2px', barTop: '2', barBottom: '2' })` | Returns the same 7-class block currently in `nav-item.variants.ts` lines 18–26 (rounded-selection, gradient, inset shadow, before content/absolute/left/top/bottom/w/rounded/bg). |
| NavItem onDark tone          | same gate; tokens swapped to `--nav-on-dark-accent[-strong]`; mix ratios 22/12/30; bar `bg-[var(--nav-on-dark-accent-strong)]`                                                                                                                                                           | Returns the matching block currently in `nav-item.variants.ts` lines 35–45.                                                                                                       |
| RadioItem                    | `gate: 'data-[state=checked]'`; tokens like NavItem default; `barInset: '1'`, `barTop: '1.5'`, `barBottom: '1.5'`                                                                                                                                                                        | Returns the block currently in `dropdown-menu.tsx` lines 102–110.                                                                                                                 |
| Negative bar inset           | `barInset: '-2px'`                                                                                                                                                                                                                                                                       | Emits `before:left-[-2px]` (Tailwind arbitrary value).                                                                                                                            |
| Positive bar inset shorthand | `barInset: '1'`                                                                                                                                                                                                                                                                          | Emits `before:left-1` (Tailwind spacing scale).                                                                                                                                   |
| Empty/missing params         | (impossible — all required)                                                                                                                                                                                                                                                              | TS rejects at compile time.                                                                                                                                                       |

## Code Map

- `packages/ui/src/lib/selection-chrome.ts` — **NEW**. Defines `SelectionChromeOptions` and `selectionChromeClasses(opts: SelectionChromeOptions): string[]`.
- `packages/ui/src/lib/selection-chrome.test.ts` — **NEW**. Vitest suite asserting the helper emits exactly the three current class blocks (NavItem default, NavItem onDark, RadioItem) byte-for-byte. RED before implementation.
- `packages/ui/src/components/nav-item/nav-item.variants.ts` — replace literal class arrays for both `default` and `onDark` tones with `...selectionChromeClasses({ gate: 'aria-[current=page]', … })` plus the non-chrome tone-specific classes (text colour, hover behaviour). Keep the `text-foreground` / `text-[var(--nav-on-dark-accent)]` tokens at the top of each tone array — those are NOT chrome.
- `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx` — in `DropdownMenuRadioItem` swap the duplicated `data-[state=checked]:…` block for `...selectionChromeClasses({ gate: 'data-[state=checked]', … })`. Keep `text-foreground` (it's not chrome — it's the active-text colour) outside the helper call.
- `packages/ui/src/index.ts` — barrel; add `export { selectionChromeClasses, type SelectionChromeOptions } from './lib/selection-chrome'` next to the existing `cn` export.

## Tasks & Acceptance

**Execution (TDD order — tests first, then implementation, then call-site swaps):**

- [ ] `packages/ui/src/lib/selection-chrome.test.ts` -- write a vitest suite with three `describe` blocks. Each emits the helper output for one of the three call-sites and asserts the resulting class list equals the literal block currently in the call-site source file (extracted as a constant in the test for readability). RED phase: the helper doesn't exist yet, so the import fails.
- [ ] `packages/ui/src/lib/selection-chrome.ts` -- create `SelectionChromeOptions` type with the parameters listed in the I/O matrix, plus a `selectionChromeClasses(opts): string[]` that returns the array. The function MUST emit the exact strings the existing call-sites use (templated with `opts`). No conditional branches — every option is required.
- [ ] `packages/ui/src/index.ts` -- add `export { selectionChromeClasses, type SelectionChromeOptions } from './lib/selection-chrome'` immediately after the `cn` export.
- [ ] `packages/ui/src/components/nav-item/nav-item.variants.ts` -- import `selectionChromeClasses`. In the `default` tone array, replace lines 18–26 with the spread call: `...selectionChromeClasses({ gate: 'aria-[current=page]', radiusToken: 'rounded-selection', gradientFrom: 'var(--primary)', gradientFromMix: 18, gradientTo: 'var(--secondary)', gradientToMix: 10, outlineToken: 'var(--primary)', outlineMix: 30, barColor: 'bg-primary', barInset: '-2px', barTop: '2', barBottom: '2' })`. In the `onDark` tone array, replace lines 35–45 with the same spread but with `gradientFrom: 'var(--nav-on-dark-accent-strong)'`, `gradientFromMix: 22`, `gradientTo: 'var(--nav-on-dark-accent)'`, `gradientToMix: 12`, `outlineToken: 'var(--nav-on-dark-accent-strong)'`, `outlineMix: 30`, `barColor: 'bg-[var(--nav-on-dark-accent-strong)]'`, same insets.
- [ ] `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx` -- import `selectionChromeClasses` from `../../lib/selection-chrome`. In `DropdownMenuRadioItem`, replace lines 102–110 with the spread call: `...selectionChromeClasses({ gate: 'data-[state=checked]', radiusToken: 'rounded-selection', gradientFrom: 'var(--primary)', gradientFromMix: 18, gradientTo: 'var(--secondary)', gradientToMix: 10, outlineToken: 'var(--primary)', outlineMix: 30, barColor: 'bg-primary', barInset: '1', barTop: '1.5', barBottom: '1.5' })`.
- [ ] Verify: `pnpm --filter @damo/ui test` (all suites green), `pnpm --filter @damo/ui typecheck`, `pnpm --filter @damo/ui build`.
- [ ] Commit with message `refactor(selection-chrome): extract shared recipe into selectionChromeClasses helper (#61)`.

**Acceptance Criteria:**

- Given a developer reads `nav-item.variants.ts` or `dropdown-menu.tsx`, when they look for the selection chrome, then they see exactly one call to `selectionChromeClasses(...)` per tone/state — not a copy-pasted multi-line block.
- Given a token-driven design change (e.g. swap the gradient mix from 18/10 to 20/12), when applied to `selectionChromeClasses` defaults or each call-site's options, then both NavItem tones AND DropdownMenuRadioItem reflect the change without further edits.
- Given the existing test suite (`nav-item.test.tsx`, `nav-item.tone-on-dark.test.ts`, `dropdown-menu.test.tsx`), when the workspace runs `pnpm --filter @damo/ui test`, then every assertion still passes — the visual contract is unchanged.
- Given the new suite (`selection-chrome.test.ts`), when run in isolation, then the three helper invocations emit class-arrays whose joined string matches the pre-refactor source-of-truth literals byte-for-byte.
- Given a consumer importing `@damo/ui`, when they call `selectionChromeClasses(...)`, then the helper is part of the public API (typed, JSDoc-documented if helpful, exported from the barrel).
- Given the bar-inset divergence (NavItem `-2px`, RadioItem `1`), when both call-sites are inspected, then the divergence is now a single explicit `barInset` argument — no longer a hidden fork.

</frozen-after-approval>

## Design Notes

**Why a helper, not a wrapper component.** The selection chrome lives on the same DOM node as the item itself (`<a>` for NavItem, Radix's `<RadioItem>` for the radio). Wrapping with `<SelectionChrome>` would either insert an extra `<div>` (breaking layout / Radix forwarding) or use `Slot` and pay for an extra rerender boundary. A class-list helper has zero runtime cost and composes with `cva` and `cn` exactly the way the existing call-sites already work.

**Why not a Tailwind `@utility` block.** Tailwind v4 supports unparametrized utility blocks but not the per-call-site token swap (`var(--primary)` vs `var(--nav-on-dark-accent-strong)`). A two-utility approach (`selection-chrome-default`, `selection-chrome-on-dark`) would solve NavItem but not the RadioItem variant where the bar inset differs. The helper keeps everything in TypeScript, with full IDE autocomplete and no extra build step.

**`string[]` return type.** `cva`'s variants accept `ClassValue` arrays, so `[...selectionChromeClasses(...)]` spreads cleanly. `cn(...)` likewise accepts spread strings. The alternative (returning a single space-joined string) would still work but loses the array-shape symmetry with the existing variant code.

**Helper does NOT include `text-foreground`.** The active-text colour differs across the three call-sites (`text-foreground` for NavItem default and RadioItem; `text-[var(--nav-on-dark-accent)]` for NavItem onDark). It's _adjacent_ to the chrome but not part of the recipe — keeping it at the call-site preserves the per-tone overrides.

## Verification

**Commands:**

- `pnpm --filter @damo/ui test` -- expected: all suites pass, including the new `selection-chrome.test.ts`.
- `pnpm --filter @damo/ui typecheck` -- expected: no errors.
- `pnpm --filter @damo/ui build` -- expected: clean build, helper present in `dist/`.
- `pnpm --filter @damo/ui lint` -- expected: clean.

**Manual checks:**

- Run the docs site (`pnpm dev:web`) and visit the NavItem story (sidebar in any nav-item docs page) — confirm the active item still shows the gradient + inset outline + left bar with the `-2px` bleed.
- Visit any DropdownMenu story with a `RadioItem` — confirm the checked item still shows the same chrome with `left-1` inset.
- DevTools → inspect the `<a aria-current="page">` and the `<div role="menuitemradio" data-state="checked">` — confirm the className strings include all the chrome utilities.

**Post-merge:**

- Queue Kipi handshake to update `nav-item.md` (Open question 2 → resolved, point at the helper) and `dropdown-menu.md` (Open question 1 → resolved, point at the helper). Add a short reference under the lib's utilities section if a "lib" knowledge chapter exists.
