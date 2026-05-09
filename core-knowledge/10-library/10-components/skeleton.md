# Skeleton

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/skeleton/{skeleton.tsx,index.ts}`,
`packages/ui/src/styles/globals.css` (the `@keyframes shimmer`).

## Summary

Loading-state placeholder with a horizontal shimmer sweep. A muted
rounded `<div>` plus a `::before` pseudo-element that holds a
left-to-right gradient driven by the `shimmer` keyframe. `aria-hidden`
by design — Skeletons are visual only.

## Public API

| Export          | Kind                                        |
| --------------- | ------------------------------------------- |
| `Skeleton`      | `forwardRef<HTMLDivElement, SkeletonProps>` |
| `SkeletonProps` | `HTMLAttributes<HTMLDivElement>`            |

No variants. Sizing is up to the consumer via `className`
(e.g. `<Skeleton className="h-4 w-32" />`).

### Always-applied classes

```
relative overflow-hidden bg-muted rounded-md
before:absolute before:inset-0 before:-translate-x-full
before:bg-gradient-to-r before:from-transparent
  before:via-[color-mix(in_oklab,var(--foreground)_6%,transparent)]
  before:to-transparent
before:animate-[shimmer_1.5s_infinite]
```

The shimmer wave is **6% of `--foreground`** mixed with transparent —
intentionally subtle, it reads as a soft sheen on top of `--muted`.

## Notes

- `@keyframes shimmer` lives in `globals.css` (single keyframe in the
  lib). Ship it together with Skeleton when copy-pasting.
- `aria-hidden="true"` is set on the wrapper — Skeletons must not be
  announced. If a consumer needs an a11y "loading" status, pair the
  Skeleton with a hidden `<span role="status">Loading…</span>` (or
  use `Spinner`).
- The animation runs at 1.5s linear, infinite. Honors
  `prefers-reduced-motion`? **No**, currently not gated. See Open
  questions.

## How to consume (shadcn-style copy)

1. Copy `skeleton.tsx` and `index.ts`.
2. Copy the `@keyframes shimmer` block from `globals.css` into the
   consumer's stylesheet (or rely on the lib's `globals.css`).
3. `color-mix` is required for the shimmer tint — see Chip's note on
   browser support.

## Open questions

1. **No `prefers-reduced-motion` gate.** Consumers who care about
   reduced-motion compliance need to opt-out via `className` overrides.
   The lib could ship the keyframe wrapped in
   `@media (prefers-reduced-motion: no-preference)`.
2. The 1.5s duration is hard-coded — could be tokenized as
   `--duration-shimmer` so theme generators can tune motion holistically.
