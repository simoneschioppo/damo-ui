# MemphisShape

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/memphis-shape/{memphis-shape.tsx,index.ts,memphis-shape.test.tsx}`.

## Summary

Decorative SVG shape primitive — 8 variants forming the lib's Memphis
visual vocabulary (diamond / circle / triangle / zigzag / blob /
wave / star / lbar). Pure SVG, fixed `viewBox 0 0 100 100`, scalable
to any pixel size via the `size` prop.

## Public API

| Export                | Kind |
|-----------------------|------|
| `MemphisShape`        | `forwardRef<SVGSVGElement, MemphisShapeProps>` |
| `MemphisShapeVariant` | `'diamond' \| 'circle' \| 'triangle' \| 'zigzag' \| 'blob' \| 'wave' \| 'star' \| 'lbar'` |

| Prop      | Type                  | Default              |
|-----------|-----------------------|----------------------|
| `variant` | `MemphisShapeVariant` | (required)           |
| `size`    | `number`              | `64`                 |
| `color`   | `string`              | `'var(--secondary)'` |
| `className`| `string`             | —                    |
| …native   | `Omit<SVGAttributes<SVGSVGElement>, 'fill'>` | — | `fill` is excluded from the surface (driven by `color`) |

## Internal architecture

### Filled vs stroke-only variants

The 8 variants split into two rendering modes:

- **Filled** (5): `diamond`, `circle`, `triangle`, `blob`, `star`, `lbar` — `<polygon|circle|path fill={color} />`
- **Stroke-only** (2): `zigzag`, `wave` — `<polyline|path fill="none" stroke={color} strokeWidth="6" />`

Source comment lists this taxonomy explicitly.

### Variant geometry summary

| Variant   | Render | Notes |
|-----------|--------|-------|
| `diamond` | `<polygon points="50,6 94,50 50,94 6,50" />` | 45° rotated square |
| `circle`  | `<circle cx=50 cy=50 r=44 />` | |
| `triangle`| `<polygon points="50,10 90,90 10,90" />` | upward-pointing |
| `zigzag`  | `<polyline …>` 6 vertices, `strokeWidth=6`, round joins/caps | 3 zigzags across viewBox |
| `blob`    | `<path d="M50 6 C72 6 …" />` | irregular rounded path |
| `wave`    | `<path d="M4 50 Q 20 10 36 50 T 68 50 T 96 50" />` strokeWidth=6 | sine-like quadratic |
| `star`    | 10-vertex polygon (5-point star) | manually computed inner/outer radii |
| `lbar`    | `<path d="M10 10 H 90 V 28 H 28 V 90 H 10 Z" />` | L-shape |

### Exhaustiveness guard

```ts
default: {
  const _exhaustive: never = variant
  return _exhaustive
}
```

TypeScript's `never`-cast pattern. If a new variant is added to the
union type without a case, the compile fails. Removing this hides
type drift.

### `aria-hidden="true"` is mandatory

```jsx
<svg … aria-hidden="true" {...rest}>
```

MemphisShape is decorative. The shape carries no meaning; assistive
tech should ignore it. Don't override `aria-hidden` to `false`; if a
shape is meant to convey meaning (rare), use `<svg role="img"
aria-label="...">` directly.

## Notes & gotchas

1. **All shapes share the same `viewBox 0 0 100 100`** — they scale
   uniformly. Mixed sizes inside a layout (passing different `size`
   per shape) work cleanly.

2. **Default color is `var(--secondary)`** — the lib's secondary
   accent. Override per instance with the `color` prop (raw CSS
   color, token reference, or `currentColor`).

3. **Stroke variants have fixed `strokeWidth=6`.** Rescaling the
   shape via `size` keeps the stroke visually proportional because
   the viewBox scales with it. For thinner strokes, override via
   `style={{ strokeWidth: 3 }}`.

4. **`fill` is excluded from native SVG props.** The `color` prop
   is the public knob.

5. **No animation** — shapes are static. Consumers can wrap in a
   `transform` keyframe.

## How to consume (shadcn-style copy)

Single-folder copy. No deps. The geometry is self-contained — copy
the `renderVariant` function verbatim. Tokens: only `--secondary`
for the default color (everything else is consumer-supplied via
`color`).

## Open questions

1. **No size variant for stroke width** — fixed at 6 in viewBox
   units. A `strokeWidth` prop would parameterize.
2. **Variants are hand-tuned geometry.** Adding a new variant
   (e.g. `arc`, `chevron`) means hand-computing coordinates and
   extending the type union.
3. **No "tilt" / "rotate" variant** — common Memphis use is
   randomly rotated shapes; today consumers wrap in
   `<div style={{ transform: 'rotate(15deg)' }}>`.
