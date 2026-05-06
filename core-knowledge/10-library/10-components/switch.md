# Switch

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/switch/{switch.tsx,index.ts}`.

## Summary

Toggle built on `@radix-ui/react-switch`, deliberately **square-knob
inside hard-cornered rectangular track** — the lib's signature
deviation from the typical pill-shaped switch. OFF = foreground knob
on `bg-card` track; ON = inverted (background knob on `bg-primary`
track). Thumb travel is **density-aware** via a `--spacing` calc.

## Public API

| Export   | Kind |
|----------|------|
| `Switch` | `forwardRef<ElementRef<typeof SwitchPrimitive.Root>, ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>` |

Props are Radix's `Switch.Root`: `checked`, `defaultChecked`,
`onCheckedChange`, `disabled`, `required`, `name`, `value`, `id`, plus
`className`.

### Track classes

```
relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center
border-2 border-memphis rounded-none bg-card
transition-colors duration-fast
data-[state=checked]:bg-primary
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
disabled:opacity-50 disabled:pointer-events-none
```

### Thumb classes

```
pointer-events-none block h-5 w-5
rounded-none bg-foreground
border-2 border-memphis
data-[state=checked]:bg-background
translate-x-0.5 transition-transform duration-fast
data-[state=checked]:translate-x-[calc(var(--spacing)*8.5-4px)]
```

## Notes & gotchas

1. **Density-aware checked translate.** The thumb's checked X-position
   is `calc(var(--spacing) * 8.5 - 4px)`. The math is documented
   inline:
   - track inner width = `w-14` minus `2 × 2px` border
   - thumb width = `w-5`
   - 2 × unchecked offset (0.5 × spacing) = `1 × spacing`
   - => checked translate lands the thumb flush against the right
     inner edge **at every density** (compact / normal / comfortable),
     because Tailwind's `--spacing` is the density-bound variable
     (see theming chapter).

   This is a load-bearing calculation. Changing the track or thumb
   dimensions requires re-deriving it. Removing it makes the thumb
   land mid-track in compact mode and overflow in comfortable mode.

2. **Inverted color on checked.**
   - Track: `bg-card` → `bg-primary`
   - Thumb: `bg-foreground` → `bg-background`

   This produces high contrast in both states without relying on a
   "tint" color. The thumb keeps its `border-memphis` border on both
   states.

3. **Square knob with `rounded-none` everywhere.** No pill shape.
   Don't soften the corners without a deliberate design decision —
   the squareness is the lib's identity for this component.

4. **`pointer-events-none` on the thumb** is mandatory — clicks must
   hit the track for Radix's keyboard/click handling to fire.

5. **Comment in source mentions "plum knob"** ("OFF: square plum
   knob on the left (dark), ivory track. ON: ivory square knob on
   the right, gold track"). The comment describes the *intended brand
   theming*, not the lib defaults — at the lib level, it's
   `bg-foreground` (neutral dark) → `bg-background` (neutral light)
   on a `bg-card` → `bg-primary` track. The plum/gold are consumer
   palette overrides.

## How to consume (shadcn-style copy)

1. Copy `switch.tsx` and `index.ts`.
2. Add `@radix-ui/react-switch` as a runtime dep.
3. Keep the `--spacing` calc — its correctness depends on the lib's
   density token (see theming chapter). If the consumer doesn't ship
   a density system, replace with a literal `translate-x-[28px]`
   (track 56 − border 4 − thumb 20 − offset 4 = 28).

## Open questions

1. The source comment about "plum/gold" is misleading — it describes a
   specific consumer palette. Worth correcting to describe the lib's
   neutral defaults.
2. **No size variant.** Locked at 28×56. A `sm` (20×40) variant would
   be useful for inline preference rows.
3. The `--spacing` calc is brittle to track-size changes. Could be
   replaced with a CSS-only solution using `right-0.5` on the thumb
   when `data-[state=checked]` (using positional rather than
   transform), at the cost of the snappy translate animation.
