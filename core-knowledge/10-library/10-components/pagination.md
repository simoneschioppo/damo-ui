# Pagination

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/pagination/{pagination.tsx,pagination-math.ts,pagination-math.test.ts,index.ts}`.

## Summary

Numeric page navigation with `Prev` / `Next` chevron buttons,
windowed page numbers (with `…` ellipses for long ranges), and a
"Page N of M" label. Page-window math is **factored out** into a
pure module (`pagination-math.ts`) with its own tests.

## Public API

| Export              | Kind |
|---------------------|------|
| `Pagination`        | `forwardRef<HTMLElement, PaginationProps>` |
| `PaginationProps`   | see below |
| `PaginationLabels`  | label-customization type |
| `computePageWindow` | (not re-exported from index — see Notes) |
| `PageItem`          | type — `number \| '…'` |

| Prop           | Type                                | Default | Notes |
|----------------|-------------------------------------|---------|-------|
| `currentPage`  | `number`                            | (req)   | 1-based |
| `totalPages`   | `number`                            | (req)   | |
| `onPageChange` | `(page: number) => void`            | (req)   | Called on prev/next/page-button |
| `maxVisible`   | `number`                            | `7`     | Max visible page-number buttons; clamped to ≥ 5 |
| `labels`       | `Partial<PaginationLabels>`         | Italian defaults | See below |
| `disabled`     | `boolean`                           | —       | Disables all buttons |
| `className`    | `string`                            | —       | |
| …native        | `HTMLAttributes<HTMLElement>`       | —       | |

### Default labels (Italian)

```ts
{
  previous: 'Precedente',
  next: 'Successivo',
  page: 'Pagina',
  pageOf: (p, t) => `Pagina ${p} di ${t}`,
}
```

Same i18n leakage as Spinner / Combobox / DatePicker. Consumers
override via the `labels` prop.

## Internal architecture

### `computePageWindow` — windowed page list

Returns an array of `PageItem` (`number | '…'`) representing the
visible page-number buttons.

Algorithm:
1. If `totalPages <= 0` → empty.
2. Clamp `max = Math.max(5, maxVisible ?? 7)`.
3. Clamp `current` into `[1, totalPages]`.
4. If `totalPages <= max` → all pages, no ellipses.
5. Otherwise: compute `half = floor((max - 3) / 2)`, build a window
   `[start, end]` around `current`, pin `1` at the front and
   `totalPages` at the back, and insert `'…'` when there's a gap.
6. Two abutting cases (window touches the start / end) drop the
   leading or trailing ellipsis and pull the window flush.

The result always has length ≤ `max + 2` (max numbered items + up
to two ellipses).

The math is **pure** and tested in `pagination-math.test.ts`. Don't
inline it into the component.

### Render layout

```
<nav aria-label="Pagination">
  <button aria-label="Precedente"><ChevronLeft/></button>
  {items.map(item => item === '…' ? <span aria-hidden>…</span> : <button aria-label="Pagina N">N</button>)}
  <button aria-label="Successivo"><ChevronRight/></button>
  <span>{labels.pageOf(currentPage, totalPages)}</span>
</nav>
```

All buttons share Memphis styling: `h-9 w-9` (page nav arrows are
square, page number buttons use `min-w-9` so two-digit numbers don't
shrink), `border-2 border-memphis bg-card`, `hover:bg-muted`.

### Active page styling

```
aria-[current=page]:bg-foreground
aria-[current=page]:text-background
aria-[current=page]:border-memphis
```

Same hard-flip used in Checkbox checked, SegmentedControl active,
Pagination current. The current page is unambiguously the dark slab
in the row.

## Notes & gotchas

1. **`maxVisible` minimum is 5.** Lower values are silently clamped
   to 5 — anything fewer doesn't fit "first + ellipsis + middle +
   ellipsis + last".

2. **Page numbers use `font-mono`** — uniform character width keeps
   the numeric column tidy.

3. **Label is rendered as plain text** (`text-xs text-muted-foreground
   font-mono`) at the right of the row. No interaction; just a
   readout.

4. **`computePageWindow` not re-exported.** It's importable
   per-file, but `index.ts` only exports the React component.
   For consumers wanting the math (custom UI), promote it.

5. **`disabled` prop blanks everything**, including the current page
   indicator. This is intentional but worth noting for transitional
   states.

6. **Italian label defaults** — see Open questions.

## How to consume (shadcn-style copy)

1. Copy the whole `pagination/` folder (including
   `pagination-math.ts` — the math is the load-bearing part).
2. Replace icon imports.
3. Translate labels via `labels` prop.
4. No external runtime deps.

## Open questions

1. **Italian default labels.** Same flag as Spinner, Combobox,
   DatePicker.
2. **`computePageWindow` not re-exported** — promote so consumers
   building custom paginators don't need to copy the math.
3. The "Page N of M" readout is hard-coded position (right of the
   buttons). A `showLabel?: boolean` or `labelPosition` axis would
   help embedded layouts.
4. **`onPageChange(currentPage - 1)` does not validate** — relies on
   `disabled` to prevent fired calls at the boundaries. If a
   consumer programmatically clicks the disabled prev button (rare),
   the handler still fires. Could guard with a manual `if`.
