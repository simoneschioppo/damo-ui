# Plan: Button `asChild` + home CTA migration

Date: 2026-05-03
Branch: `feat/button-as-child`
Spec: [docs/specs/2026-05-03-button-as-child.md](../specs/2026-05-03-button-as-child.md)

## Objective

Add `asChild?: boolean` to `Button` (Radix Slot pattern) so that consumers
can render a `<Link>` or `<a>` with all Button classes applied — including
the Memphis press animation
(`active:translate-x-[3px] translate-y-[3px] shadow-memphis-active`).
Migrate the home page hero CTAs to use this new pattern, deleting the
hand-rolled `ctaPrimaryClass` / `ctaGhostClass` utility strings.

## Phases

### Phase 1 — Specs & dependency

- Spec doc + plan doc.
- Promote `@radix-ui/react-slot` to a direct dependency of `@damo/ui`.

### Phase 2 — Library: tests + implementation (TDD)

- Append failing `describe('asChild', …)` block to `button.test.tsx`
  covering: child rendering, variant/size/hover/active classes on the
  child, ref forwarding to the child DOM node, attribute preservation,
  and the non-propagation of `type="button"` to non-button children.
- Implement `asChild` in `button.tsx`: import `Slot`, choose
  `Comp = asChild ? Slot : 'button'`, conditionally include `type` only
  when rendering a real `<button>`.
- Add `AsLink` story in `button.stories.tsx`.

### Phase 3 — Documentation page

- Rewrite the "Use as a link" section in
  `apps/web/app/docs/components/button/page.tsx`. Replace the snippet that
  used to declare `Button does not support asChild` with the new pattern.
- Add an `asChild` row to the props table.
- Render a live example using `<Button asChild>`.

### Phase 4 — Web app migration

- `apps/web/app/page.tsx`: replace the two `<Link className={…}>` CTAs with
  `<Button asChild variant="primary|ghost" size="lg">` wrappers; delete the
  utility-string constants.

### Phase 5 — E2E

- Verify existing `home-hero.spec.ts` tests (navigation) continue to pass.
- Add an assertion that the rendered `<a>` carries the Memphis press class
  `active:translate-x-[3px]`.

### Phase 6 — Quality + Git

- `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm test:e2e` all green.
- Code review pass.
- Commit, push, open PR, merge with `gh pr merge <N> --merge --delete-branch`.

## Risks

- `type="button"` leaking onto child `<a>` — mitigated by conditional spread.
- Visual regression of CTAs (`size="lg"` vs prior `px-6 py-3`) — verified
  manually before merge.
- Slot's single-child requirement — documented in JSDoc and spec.

## Done when

- [ ] All 18 existing Button tests pass.
- [ ] New `asChild` tests pass (8+ cases).
- [ ] Home CTAs use `<Button asChild>`; press animation visible on click.
- [ ] Docs page reflects new capability.
- [ ] PR merged into `main` with `--merge` (no squash).
