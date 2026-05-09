# SegmentedControl

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/segmented-control/{segmented-control.tsx,index.ts}`.

## Summary

Single-select toggle row built on `@radix-ui/react-toggle-group` with
`type="single"` locked at the wrapper level. Visually a single
Memphis-bordered container with internal dividers between segments;
the active segment flips to inverted colors (`bg-foreground
text-background`).

## Public API

| Export                  | Kind                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `SegmentedControl`      | `forwardRef<…, SegmentedControlProps>`                                                                     |
| `SegmentedControlItem`  | `forwardRef<…, ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>>`                                |
| `SegmentedControlProps` | `Omit<ToggleGroupSingleRootProps, 'type' \| 'orientation'> & { orientation?: 'horizontal' \| 'vertical' }` |

Notable type narrowing: `ToggleGroupSingleRootProps` extracts only the
`type: 'single'` variant of Radix's discriminated union, so consumers
can't accidentally pass `type="multiple"`. The wrapper hard-codes
`type="single"`.

`orientation` is re-typed (excluded from Radix base, re-added) so the
default `'horizontal'` is applied at the wrapper.

## Internal architecture

### Root container

```
inline-flex border-2 border-memphis rounded-none bg-card
data-[orientation=vertical]:flex-col
```

Horizontal by default; vertical mode flips to a stacked column.

### Item

```
inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold
cursor-pointer text-muted-foreground
transition-colors duration-fast
hover:bg-muted hover:text-foreground
data-[state=on]:bg-foreground data-[state=on]:text-background
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring
disabled:opacity-50 disabled:pointer-events-none
not-first:border-l-2 not-first:border-l-memphis
data-[orientation=vertical]:not-first:border-l-0
data-[orientation=vertical]:not-first:border-t-2
data-[orientation=vertical]:not-first:border-t-memphis
```

Three details worth flagging:

1. **`focus-visible:outline-offset-[-2px]`** (negative offset). The
   focus ring is drawn _inside_ the item rather than outside —
   because items share a Memphis-bordered container, an outside ring
   would be clipped by the neighbour. Inside-offset preserves the
   ring inside the segment box.
2. **`not-first:border-l-2 border-l-memphis`** divides horizontal
   segments. Vertical mode swaps to `border-t-2 border-t-memphis`
   (and resets the left border to 0). This is how the "internal
   dividers but a single outer border" effect is achieved.
3. **Active state** is the same hard-flip used in Checkbox checked
   (`bg-foreground text-background`) — no tint, just inversion.

## Notes & gotchas

1. **Single-select only.** Multi-select needs Radix's `type="multiple"`
   directly — SegmentedControl doesn't expose it.
2. **`not-first:` is a Tailwind v4 variant** (alias for
   `[&:not(:first-child)]`). Available in v4 only; v3 consumers need
   to expand it.
3. **Focus ring uses negative offset** — see above. Don't change to a
   positive offset without re-evaluating the visual.
4. **No size variant.** `px-3 py-1.5 text-sm` is the only size.

## How to consume (shadcn-style copy)

1. Copy `segmented-control.tsx` and `index.ts`.
2. Add `@radix-ui/react-toggle-group` as a runtime dep.
3. Tailwind v4 required for `not-first:` (v3: replace with
   `[&:not(:first-child)]`).

## Open questions

1. **No size axis.** A `sm` (compact) variant is plausible for
   inline toolbars.
2. The negative-offset focus ring is unusual — should be documented in
   `30-cross-cutting/20-conventions.md` as a recognized pattern for
   "items inside a single bordered container".
