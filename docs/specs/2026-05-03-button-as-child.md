# Button — `asChild` prop

Date: 2026-05-03
Status: Implemented
Author: damacchi-ui team

## Motivation

The home page hero used hand-rolled Tailwind classes on `<Link>` to mimic
`Button`-style CTAs. The duplicate utility strings drifted out of sync with
the canonical Button variants — most importantly, they were missing the
Memphis "press" animation
(`active:translate-x-[3px] translate-y-[3px] shadow-memphis-active`) that
collapses the offset shadow when the button is clicked. As a result the home
CTAs looked like Memphis buttons but did not feel like them.

`Button asChild` adopts the standard React composition pattern (Radix Slot,
also used by shadcn/ui): the component merges all of its classes onto a
single child element instead of rendering a `<button>` itself. Consumers can
now write:

```tsx
<Button asChild variant="primary" size="lg">
  <Link href="/docs">Browse docs</Link>
</Button>
```

and the rendered `<a>` carries every Button class — variant, size, hover
lift, active press, focus ring — without duplication.

## API

```ts
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  /**
   * When true, the child element is rendered with all Button classes
   * applied (Radix Slot pattern). The child must be a single React element
   * such as a `<Link>` or `<a>`. Default: `false`.
   *
   * Notes:
   * - `type="button"` is not propagated to non-button children.
   * - `disabled` is a button-only feature; on a non-button child the CSS
   *   `disabled:` utilities still take effect, but the child must opt out
   *   of pointer interaction itself.
   * - The forwarded `ref` points to the child DOM node when `asChild` is
   *   true (e.g. `HTMLAnchorElement` for `<Link>`).
   */
  asChild?: boolean
}
```

The public `forwardRef` generic stays as `HTMLButtonElement` for backwards
compatibility with the existing 18 unit tests and with `IconButton`. At
runtime the ref points to whichever DOM node the child renders to.

## Behavior

- `asChild` defaults to `false`. The component renders `<button type="button">`
  exactly as before — no behavioral change for existing consumers.
- When `asChild` is `true`, `Button` renders `<Slot>` from
  `@radix-ui/react-slot` with the same className computation. Slot merges
  the classes onto the single child element and forwards `ref` and event
  handlers.
- `type="button"` is not included in the spread when `asChild` is true.

## Edge cases

- **Multiple children**: Slot throws at runtime if the child isn't a single
  React element. This is desirable; the error message points at the misuse.
- **`disabled` on `<a>`**: `<a>` does not support the `disabled` HTML
  attribute. Passing `disabled` to `<Button asChild>` will write the
  attribute (browsers ignore it on anchors) and apply the CSS utilities
  (`disabled:opacity-50 disabled:pointer-events-none`). For a fully disabled
  link, also remove `href` or set `aria-disabled="true"` on the child.
- **`type` prop**: Always omitted from the props spread when `asChild` is
  true. Verified by unit test.

## Backwards compatibility

- `ButtonProps` is extended additively with an optional `asChild` prop.
- All 18 existing unit tests in `button.test.tsx` keep passing without
  modification.
- `IconButton` (which wraps `Button`) does not pass `asChild`. No changes
  to the IconButton API.

## Migration in this change

`apps/web/app/page.tsx` had two CTA links rendered with hand-rolled
Tailwind:

```tsx
<Link href="/docs" className={ctaPrimaryClass}>Browse docs</Link>
<Link href="/theme-generator" className={ctaGhostClass}>Open theme generator</Link>
```

Both are replaced with `<Button asChild>` wrappers. `ctaPrimaryClass` and
`ctaGhostClass` are deleted.

## Security

No new attack surface. All inputs are dev-controlled (variant, size, child
element). `Slot` does not execute user content; it merges props by reference.

## File map

- `packages/ui/src/components/button/button.tsx` — `asChild` implementation.
- `packages/ui/src/components/button/button.test.tsx` — new tests.
- `packages/ui/src/components/button/button.stories.tsx` — `AsLink` story.
- `packages/ui/package.json` — `@radix-ui/react-slot` as direct dependency.
- `apps/web/app/page.tsx` — home CTAs migrated.
- `apps/web/app/docs/components/button/page.tsx` — docs page rewritten for
  the "Use as a link" section.
- `e2e/tests/scenarios/home-hero.spec.ts` — assert Memphis press classes on
  the rendered CTA.
