# IconButton

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/icon-button/{icon-button.tsx,index.ts}`.

## Summary

Thin wrapper around `Button` that forces `size="icon"`, requires
`aria-label`, and removes the `asChild` escape hatch. Use it when the
visual is icon-only and there's no visible text. For everything else
(including `<Button size="icon" />` with `asChild`), use `Button`
directly.

## Public API

| Export            | Kind                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `IconButton`      | `forwardRef<HTMLButtonElement, IconButtonProps>`                                                       |
| `IconButtonProps` | `Omit<ButtonProps, 'size' \| 'children' \| 'asChild'> & { 'aria-label': string; children: ReactNode }` |

`aria-label` is **required by the type system** — there's no visible
text, so an a11y label is mandatory. `size` and `asChild` are removed
from the prop surface (size is locked to `'icon'`; the wrapper is
deliberately not Slot-aware).

All other Button props pass through unchanged: `variant`, `fullWidth`,
`disabled`, native button attrs, `className`, `ref`.

## Notes

- Renders `<Button size="icon" {...rest}>{children}</Button>` — no other
  logic.
- `size="icon"` resolves to `h-10 w-10 p-0` (40×40) in `Button` —
  see Button chapter for the full size scale.
- All variant styling, Memphis idiom, focus ring, and the
  `data-[state=open]` press affordance come from `Button`.
- No `asChild` means a Next `<Link>` icon-only button needs to use
  `<Button asChild size="icon" aria-label="…"><Link>...</Link></Button>`
  directly. Keep this in mind before replacing a `Button asChild` with
  `IconButton`.

## How to consume (shadcn-style copy)

Copy `icon-button.tsx` and `index.ts` after `button` is in place. No
direct dependencies of its own.

## Open questions

1. Should IconButton also accept `asChild`? The current omission is
   intentional but not documented in the type comment. If a consumer
   needs an icon-only `<Link>`, they fall back to `<Button asChild
size="icon" />` — fine, but duplicates the IconButton ergonomics.
