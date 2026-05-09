---
title: 'gh-60 — refactor specialized cards to compose <Card>'
type: 'refactor'
created: '2026-05-08'
baseline_commit: '5fb9237ffd42a27dca6c444f2ab835f84ac409c9'
status: 'done'
context:
  - '{project-root}/CLAUDE.md'
  - '{project-root}/core-knowledge/10-library/10-components/card.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `ArticleCard`, `FeatureCard`, `UserCard` duplicate the Memphis frame (`border-2 border-memphis rounded-none`), shadow, and padding logic of the generic `<Card>` instead of composing it. Token edits must be replicated in 4 places, and the lib has no shared mental model with `<Card>`.

**Approach:** Replace each card's outer `<div>` with `<Card variant=… padding=…>`, delegating frame + shadow + padding. Keep each card's bespoke inner slots (custom typography, avatar, meta/icon footer) — they don't map cleanly to `Card`'s sub-parts. Public APIs and visual output stay identical.

## Boundaries & Constraints

**Always:**

- Public TS interfaces of `ArticleCardProps`, `FeatureCardProps`, `UserCardProps` are unchanged (same fields, same optionality).
- Visual parity: same border, same shadow, same padding (in pixels), same dimensions, same slot typography. Verified by tests + manual diff in docs page.
- `className` and `...rest` props flow through to the underlying `<Card>` and merge with its variant classes.
- `data-slot="…"` attributes on inner slots stay (label/title/body/desc/meta/icon/avatar/name/trailing) — consumers may rely on them.
- Specialized cards remain exported from `packages/ui/src/index.ts` with their original names.

**Ask First:**

- If `shadow-memphis` (Card's class) and `var(--shadow-memphis-card)` (inline shadow on specialized cards) resolve to different CSS values, halt and ask whether to (a) add a new Card variant or (b) keep an inline override on the specialized card.
- If a specialized card's required padding (`p-6` for ArticleCard, `p-4` for UserCard) cannot be expressed via Card's scale (`none|sm|md|lg`) without visual regression, halt and ask whether to extend Card's padding scale or use the `padding="none"` + className escape hatch.

**Never:**

- Do not edit files inside `core-knowledge/` directly — queue Kipi handshake at the end.
- Do not rename or remove `ArticleCard`, `FeatureCard`, `UserCard`. (Out of scope per issue.)
- Do not change Card's own variants/sub-parts unless the "Ask First" gate fires.
- Do not introduce new public props on the specialized cards (e.g. exposing `padding` or `variant`) — internal composition only.

## I/O & Edge-Case Matrix

| Scenario                    | Input / State                      | Expected Output / Behavior                                                                  |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| ArticleCard label optional  | with/without `label` prop          | Label slot rendered or absent; `max-w-[420px]` always applied                               |
| FeatureCard footer optional | with/without `meta`/`icon`         | Footer row rendered when either present, else absent; primary tint via `variant="featured"` |
| UserCard avatar fallback    | `name="Foo"`, no `avatar`          | First grapheme `"F"` in circle; custom `avatar` overrides                                   |
| UserCard optional slots     | `meta` / `trailing` undefined      | Slots not in DOM                                                                            |
| All cards: passthrough      | `className="x"`, `data-testid="y"` | Merged onto root `<Card>`; single root element (no double `<div>`)                          |

</frozen-after-approval>

## Code Map

- `packages/ui/src/components/card/card.tsx` — generic `<Card>` (variants: default/elevated/featured/interactive/inverse; padding: none/sm/md/lg). Composition target. Read-only.
- `packages/ui/src/components/card/card.variants.ts` — CVA recipe. Read-only unless "Ask First" gate fires.
- `packages/ui/src/components/article-card/article-card.tsx` — refactor target. Use `variant="default"`, `padding="none"`, `className="p-6 max-w-[420px]"` to preserve `p-6`.
- `packages/ui/src/components/article-card/article-card.test.tsx` — update inline-style assertions (`style.maxWidth`, `style.boxShadow`) to className/Card-class assertions.
- `packages/ui/src/components/feature-card/feature-card.tsx` — refactor target. Use `variant="featured"` (auto-tints shadow), `padding="md"` (matches `p-5`), `className="w-[280px]"`.
- `packages/ui/src/components/feature-card/feature-card.test.tsx` — update `style.width` and primary-tint assertions to className + variant assertions.
- `packages/ui/src/components/user-card/user-card.tsx` — refactor target. Use `variant="default"`, `padding="none"`, `className="flex items-center gap-[14px] w-full p-4"` to preserve `p-4`.
- `packages/ui/src/components/user-card/user-card.test.tsx` — update inline-style assertions to className/Card-class assertions.
- `packages/ui/src/index.ts` — barrel; exports unchanged.
- `apps/web/app/docs/components/{article-card,feature-card,user-card}/page.tsx` — visual regression check (run dev server, compare).

## Tasks & Acceptance

**Execution:**

- [x] `packages/ui/src/components/article-card/article-card.tsx` -- replace outer `<div>` with `<Card variant="default" padding="none" className={cn("p-6 max-w-[420px]", className)} ref={ref} {...rest}>`; drop inline `style={{ maxWidth, boxShadow }}`; keep label/title/body slots verbatim.
- [x] `packages/ui/src/components/article-card/article-card.test.tsx` -- replace `expect(...).toHaveStyle({ maxWidth })` with className assertion; replace `var(--shadow-memphis-card)` style check with class-based check (`shadow-memphis`); confirm `border-2 border-memphis rounded-none` still present (now via Card).
- [x] `packages/ui/src/components/feature-card/feature-card.tsx` -- replace outer `<div>` with `<Card variant="featured" padding="md" className={cn("w-[280px]", className)} ref={ref} {...rest}>`; drop inline `--memphis-shadow-color` override (variant="featured" provides it) and inline boxShadow; keep title/desc/meta/icon slots verbatim.
- [x] `packages/ui/src/components/feature-card/feature-card.test.tsx` -- update `style.width` check to className `w-[280px]`; replace `--memphis-shadow-color` style check with `variant="featured"`-applied class check; confirm Memphis frame classes still present.
- [x] `packages/ui/src/components/user-card/user-card.tsx` -- replace outer `<div>` with `<Card variant="default" padding="none" className={cn("flex items-center gap-[14px] w-full p-4", className)} ref={ref} {...rest}>`; drop inline `boxShadow`; keep avatar/name/meta/trailing slots verbatim.
- [x] `packages/ui/src/components/user-card/user-card.test.tsx` -- replace inline `style.boxShadow` check with class-based check; confirm Memphis frame, gap, full-width still present.

**Acceptance Criteria:**

- Given a consumer importing `ArticleCard` / `FeatureCard` / `UserCard`, when they pass any combination of public props, then the rendered output is visually identical (border, shadow, padding in px, dimensions, typography, slots) to pre-refactor output.
- Given the workspace, when `pnpm --filter @damo/ui test` runs, then all existing tests pass without skips or `.only`.
- Given the workspace, when `pnpm --filter @damo/ui typecheck` runs, then there are no new type errors.
- Given a reader of `article-card.tsx` / `feature-card.tsx` / `user-card.tsx`, when they read the source, then the outer element is `<Card …>` (not a hand-rolled `<div>` with Memphis classes).
- Given a Card-token edit (e.g. shadow color, border width), when applied to `card.variants.ts`, then all 4 cards reflect the change without further edits to the specialized files.

## Spec Change Log

- **2026-05-08 — Shadow unification (Ask First gate fired).** Discovered `--shadow-memphis-card` (4px) ≠ `--shadow-memphis` (6px). User chose option **B**: align all specialized cards to Card's 6px default by dropping the inline `boxShadow` override. Behavioral parity for **frame/padding/dimensions** holds; **shadow gains +2px** intentionally — that's the issue's "unify token edits in one place" intent. Test assertions updated from inline-style checks to className `shadow-memphis` checks. **KEEP**: `variant="featured"` on FeatureCard still wires `--memphis-shadow-color: var(--primary)`, so primary-tinted shadow survives.

## Design Notes

**Custom slots, not Card sub-parts.** ArticleCard's title is `<h4>`; Card's `CardTitle` is `<h3>`. Mapping them would silently change heading levels or require a new `as` prop on `CardTitle` — both bigger than the issue's scope. Inner slots stay verbatim; only frame/shadow/padding delegate.

**`padding="none"` + className for off-scale paddings.** Card's scale is `0/3/5/8` (rem multiples). ArticleCard needs `p-6` and UserCard needs `p-4` — neither on the scale. The issue's literal `padding="lg"` mapping would shift ArticleCard from 24px to 32px = visual regression, violating "behavioral parity" AC. Escape hatch chosen; the "Ask First" gate lets the reviewer extend the scale instead.

## Verification

**Commands:**

- `pnpm --filter @damo/ui test` -- expected: all tests pass (Card + 3 specialized cards).
- `pnpm --filter @damo/ui typecheck` -- expected: no type errors.
- `pnpm --filter @damo/ui build` -- expected: clean build.
- `pnpm --filter web dev` then visit `/docs/components/article-card`, `/feature-card`, `/user-card` -- expected: visual diff vs `main` branch is zero.

**Manual checks:**

- DevTools → inspect each specialized card's root element → confirm it carries Card's variant classes (`shadow-memphis`, `border-2 border-memphis rounded-none`, etc.) AND the specialized card's own classes (e.g. `max-w-[420px]`).
- Confirm `data-slot` attributes still present inside.
- After merge, queue Kipi handshake to update the 4 core-knowledge chapters (Card OQ 1, ArticleCard OQ 3, FeatureCard OQ 4, UserCard composition note).
