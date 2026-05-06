# Medal

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/medal/{medal.tsx,index.ts,medal.test.tsx}`.

## Summary

Decorative ranking medal — heptagon SVG with an outer ring and inner
fill, both colored by `--medal-{rank}-{outer/inner/text}` tokens. 5
ranks (bronze / silver / gold / master / grandmaster), optional text
inside (digits or letters), optional caption below.

## Public API

| Export       | Kind |
|--------------|------|
| `Medal`      | `forwardRef<HTMLDivElement, MedalProps>` |
| `MedalRank`  | `'bronze' \| 'silver' \| 'gold' \| 'master' \| 'grandmaster'` |
| `MedalProps` | see below |

| Prop      | Type                  | Default | Notes |
|-----------|-----------------------|---------|-------|
| `rank`    | `MedalRank`           | (req)   | Drives the color trio |
| `label`   | `string`              | —       | Caption below the SVG |
| `value`   | `ReactNode`           | —       | Rendered inside the medal (e.g. `1`, `"M"`, `"GM"`) |
| `size`    | `number`              | `96`    | px (width + height of the SVG) |
| `className`| `string`             | —       | Applied to outer wrapper |
| …native   | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | — | |

## Internal architecture

### Heptagon geometry

The medal is a **regular-ish heptagon** computed once at module load:

```ts
const CENTER = 32
const INNER_SCALE = 0.85

const OUTER_COORDS = [
  [32,4], [54,14], [58,38], [42,58], [22,58], [6,38], [10,14],
]

const OUTER_POINTS = toPoints(OUTER_COORDS)
const INNER_POINTS = toPoints(
  OUTER_COORDS.map(([x, y]) => [
    CENTER + (x - CENTER) * INNER_SCALE,
    CENTER + (y - CENTER) * INNER_SCALE,
  ])
)
```

The inner heptagon is the outer scaled toward the center by 0.85 —
producing a uniform "ring" of border thickness (the visible portion
between the two polygons). Higher `INNER_SCALE` → thinner border.
Source comment documents this.

### Token-driven coloring

```ts
const outerFill = `var(--medal-${rank}-outer)`
const innerFill = `var(--medal-${rank}-inner)`
const textFill  = `var(--medal-${rank}-text)`
```

5 ranks × 3 colors = 15 tokens, all defined in `tokens.css` (see
theming chapter, "Medal ranks" section).

Defaults from `tokens.css`:

| Rank        | Outer (border)       | Inner (fill)         | Text |
|-------------|----------------------|----------------------|------|
| bronze      | `#5a3f20`            | `#8a6236`            | white |
| silver      | `#4a4a55`            | `#8a8a9a`            | white |
| gold        | `#18181b`            | `#d4af37`            | dark |
| master      | `#18181b`            | `#5b21b6`            | white |
| grandmaster | `#000000`            | `#d4af37`            | dark |

### Render

```jsx
<div className="inline-flex flex-col items-center gap-1">
  <svg viewBox="0 0 64 64" aria-label={label ?? `${rank} medal`} role="img">
    <polygon points={OUTER_POINTS} fill={outerFill}
             stroke="var(--memphis-border-color)" strokeWidth="0.5"/>
    <polygon points={INNER_POINTS} fill={innerFill}/>
    {value && (
      <text x="32" y="40" textAnchor="middle"
            fontFamily="var(--font-display)" fontSize="22" fontWeight="700"
            fill={textFill}>
        {value}
      </text>
    )}
  </svg>
  {label && <span className="font-mono text-[10px] font-bold uppercase
                              tracking-wider text-muted-foreground">{label}</span>}
</div>
```

A 0.5px Memphis-bordered outer outline gives the medal a thin black
contour regardless of the outer fill.

## Notes & gotchas

1. **`viewBox` is fixed 0 0 64 64.** The medal always renders at
   `size × size` pixels with the same internal geometry. Larger
   sizes scale up cleanly (it's an SVG).

2. **Text position (`y="40"`)** is empirically tuned for the
   heptagon's geometry — places digits visually centered. Multi-char
   values (`"GM"`) may look off-center; the source uses
   `textAnchor="middle"` plus `fontSize="22"` which works for 1–3
   characters.

3. **`role="img"` and `aria-label`** make the SVG announce its rank
   to assistive tech. Default label: `"${rank} medal"` (e.g. `"gold
   medal"`). Override via the `label` prop.

4. **`label` displayed below** uses the lib's small mono uppercase
   typography. Same as Stat, TableHead, etc.

5. **No size variant axis** — pass `size` numerically.

6. **All colors are tokenized** — overriding `--medal-gold-inner`
   in a parent re-tints all gold medals downstream. Useful for
   per-page brand variants.

## How to consume (shadcn-style copy)

1. Copy `medal.tsx` and `index.ts`.
2. Tokens: 15 medal tokens (`--medal-{bronze,silver,gold,master,
   grandmaster}-{outer,inner,text}`), `--memphis-border-color`,
   `--font-display`, `--muted-foreground`. See theming chapter for
   the default values.

## Open questions

1. **Geometry tuning for multi-char values.** `"GM"` on the
   grandmaster medal needs a smaller `fontSize` to fit; today
   it overflows the heptagon's narrow tip. A `valueFontSize` prop
   or auto-sizing would help.
2. **No `tier="all"` group component.** A horizontal row of medals
   1–5 is a common UX; consumers compose externally.
3. **5 ranks hard-coded.** Adding a 6th (e.g. "elite") requires
   editing the type union plus adding tokens.
