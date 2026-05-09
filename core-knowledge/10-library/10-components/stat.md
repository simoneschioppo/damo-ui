# Stat

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/stat/{stat.tsx,index.ts}`.

## Summary

Compact KPI block: small uppercase label (with optional inline icon)
on top, large display-font value in the middle, optional small delta
caption below (color-coded by tone). No frame, no padding — Stat is a
**typography-only primitive** designed to be placed inside any
container (a Card, a grid cell, etc.).

## Public API

| Export      | Kind                                    |
| ----------- | --------------------------------------- |
| `Stat`      | `forwardRef<HTMLDivElement, StatProps>` |
| `StatProps` | see below                               |

| Prop        | Type                                    | Default     |
| ----------- | --------------------------------------- | ----------- |
| `label`     | `ReactNode`                             | (required)  |
| `value`     | `ReactNode`                             | (required)  |
| `delta`     | `ReactNode`                             | —           |
| `deltaTone` | `'positive' \| 'negative' \| 'neutral'` | `'neutral'` |
| `icon`      | `ReactNode`                             | —           |
| `className` | `string`                                | —           |
| …native     | `HTMLAttributes<HTMLDivElement>`        | —           |

## Internal architecture

```jsx
<div className="flex flex-col gap-1">
  <div className="flex items-center gap-2">
    {icon && <span className="inline-flex text-muted-foreground">{icon}</span>}
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
      {label}
    </span>
  </div>
  <span className="font-display text-3xl leading-none text-foreground">{value}</span>
  {delta !== undefined && (
    <span
      className={cn(
        'text-xs font-semibold font-mono',
        positive && 'text-success',
        negative && 'text-destructive',
        neutral && 'text-muted-foreground',
      )}
    >
      {delta}
    </span>
  )}
</div>
```

Three rows top-to-bottom:

1. **Label row**: optional icon + uppercase mono caption.
2. **Value**: display-font, 30px, leading-none (so multi-stat rows
   align baselines cleanly).
3. **Delta** (optional): mono semibold, color by tone.

### Delta tones

- `positive` → `text-success` (green)
- `negative` → `text-destructive` (red)
- `neutral` → `text-muted-foreground` (default)

The delta `ReactNode` is responsible for the actual content (e.g.
`'+12%'`, `'↓ 0.4'`). Stat doesn't auto-prefix arrows or signs.

## Notes & gotchas

1. **No frame, no padding.** Stat is bare typography. Wrap in a
   Card / Container / Box for a visually contained KPI.

2. **`leading-none` on value** means a multi-line value collapses
   to no inter-line space. Don't pass multi-line strings.

3. **`delta !== undefined`** — explicit undefined check (not
   truthy). A `delta={0}` or `delta={false}` _would_ render. This
   matches React conventions but worth noting.

4. **`icon` is `ReactNode`** — pass any sized icon (`<TrendUpIcon
size={14} />`). The wrapper is `inline-flex` with no fixed size.

5. **Label uses `font-mono uppercase tracking-wider`** — same
   typography as Label / TableHead / SelectLabel. Reads as
   "metric name", not "form label".

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--muted-foreground`, `--foreground`,
`--success`, `--destructive`, `--font-display`. No external deps.

## Open questions

1. **No size variant.** `text-3xl` value is fixed. Dashboards with
   many small stats may want `sm` (text-xl) or `lg` (text-5xl).
2. **No "trend arrow" prefix** — consumers compose with
   `delta={<><ArrowUpIcon /> 12%</>}`. A `deltaIcon` prop would
   reduce boilerplate.
3. **No "sparkline" slot.** Common KPI extension; today consumers
   render below.
