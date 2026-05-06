# Slider

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/slider/{slider.tsx,index.ts,slider.test.tsx}`.

## Summary

Wrapper around `@radix-ui/react-slider` with Memphis-styled track,
range, and thumb. Thumb is a square 20×20 with thick black border,
"grab" cursor at rest and "grabbing" while dragging. Supports
horizontal and vertical orientations and **range mode** (multiple
thumbs from a multi-element `value`).

## Public API

| Export   | Kind |
|----------|------|
| `Slider` | `forwardRef<ElementRef<typeof SliderPrimitive.Root>, ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>` |

Props are exactly Radix's `Slider.Root`: `value`, `defaultValue`
(both `number[]`), `onValueChange`, `min`, `max`, `step`,
`orientation`, `disabled`, `inverted`, `dir`, plus `className`. No
range-mode flag — Radix infers it from `value.length` /
`defaultValue.length`.

## Internal architecture

The wrapper renders:

```
SliderPrimitive.Root
├── SliderPrimitive.Track
│   └── SliderPrimitive.Range
└── SliderPrimitive.Thumb × thumbCount
```

### Thumb count derivation (load-bearing)

Radix expects **exactly one `<Thumb />` per value**. Rendering one
static thumb silently breaks range sliders (the second/third value is
draggable but invisible).

```ts
const initialUncontrolledCount = useRef(
  Array.isArray(defaultValue) ? Math.max(1, defaultValue.length) : 1,
).current
const thumbCount = Array.isArray(value) ? Math.max(1, value.length) : initialUncontrolledCount
```

Two regimes:

- **Uncontrolled**: count is **frozen at mount** (`useRef`). Radix
  internally locks the thumb count on mount and ignores later
  `defaultValue` changes — so the wrapper matches that. Changing
  `defaultValue` post-mount has no effect on either Radix or the
  wrapper.
- **Controlled**: count follows `value.length` dynamically. A parent
  that reshapes the value array (e.g. adding a third handle) gets a
  matching number of thumbs. Radix's controlled API tolerates this.

This is documented inline in source as a hard invariant.

### Track and range

```
relative grow overflow-hidden bg-card
border-2 border-memphis rounded-none
data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full
data-[orientation=vertical]:w-3 data-[orientation=vertical]:h-full
```

- Track: 12px thick (h-3 horizontal / w-3 vertical), Memphis bordered.
- Range: `bg-primary` filled portion. Spans the full minor-axis
  via `data-[orientation=…]:h-full` / `:w-full`.

### Root layout

`data-[orientation=horizontal]:w-full` and
`data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col`
— **width and height are orientation-specific**. An unconditional
`w-full` on the root squashes vertical mode. This is the second
load-bearing invariant.

### Thumb

```
block h-5 w-5 bg-background border-2 border-memphis rounded-none
cursor-grab active:cursor-grabbing
transition-[transform,box-shadow] duration-snap ease-memphis
focus-visible:outline-2 outline-offset-2 outline-ring
disabled:pointer-events-none
```

Square knob (matches Switch's signature). Standard focus ring (no
tinted Memphis shadow on Slider thumbs — they already convey position
via location).

## Notes & gotchas

1. **Range mode is implicit.** No `mode="range"` prop. Pass
   `defaultValue={[20, 80]}` (or `value={[20, 80]}`) and Radix renders
   two thumbs.

2. **`defaultValue` changes post-mount don't update thumb count** in
   uncontrolled mode — by design, mirroring Radix. If a parent needs
   to reshape the array, switch to controlled mode.

3. **No tick marks, no value labels.** Pure track + range + thumb.
   Consumers add their own tick rendering or value tooltips.

4. **`bg-background` on the thumb** is intentional — the thumb sits
   on the track which can be `bg-card` or `bg-muted`-tinted, and
   `bg-background` (page color) gives a clean visual stamp.

5. **`active:cursor-grabbing`** is browser CSS; Radix doesn't drive
   it. Works because the thumb gets `:active` while dragging.

## How to consume (shadcn-style copy)

1. Copy `slider.tsx` and `index.ts`.
2. Add `@radix-ui/react-slider` as a runtime dep.
3. Keep the `useRef` thumb-count logic verbatim — replacing it with a
   simpler "render value.length thumbs" breaks uncontrolled range
   mode.

## Open questions

1. The `useRef`-frozen uncontrolled count is correct but surprising.
   Worth a JSDoc note on the exported component (currently the
   rationale is only in inline comments).
2. No tick / step indicators. For sliders with discrete values
   (`step=10` over 0..100) consumers often want tick marks.
3. No "two-thumb labels" pattern — consumers building min/max range
   pickers re-derive labels each render.
