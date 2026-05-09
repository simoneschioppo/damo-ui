# Table

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/table/{table.tsx,index.ts}`.

## Summary

Hand-rolled (no Radix) table primitives matching the lib's typography
and Memphis chrome: outer `<div>` wrapper with overflow-scroll and
Memphis border, header row inverted (`bg-foreground text-background`)
with mono-uppercase column titles, body with neutral 1px row dividers.

## Public API

8 exports — one for each table semantic element:

| Export         | Renders                     | Notes                                           |
| -------------- | --------------------------- | ----------------------------------------------- |
| `Table`        | wrapper `<div>` + `<table>` | wrapper provides overflow + Memphis frame       |
| `TableHeader`  | `<thead>`                   | inverted slab                                   |
| `TableBody`    | `<tbody>`                   | last child has no bottom border                 |
| `TableFooter`  | `<tfoot>`                   | muted bg, top Memphis rule                      |
| `TableRow`     | `<tr>`                      | bottom border, supports `data-state="selected"` |
| `TableHead`    | `<th>`                      | mono-uppercase column header                    |
| `TableCell`    | `<td>`                      | standard cell                                   |
| `TableCaption` | `<caption>`                 | bottom-aligned (browser default)                |

All accept native `*HTMLAttributes` plus `className`.

## Internal architecture

### Outer wrapper (in Table)

```jsx
<div className="w-full overflow-x-auto border-2 border-memphis rounded-none">
  <table className="w-full caption-bottom text-sm">{...}</table>
</div>
```

Two reasons for the wrapper:

1. **Overflow scrolls horizontally** when columns exceed container
   width — the `<table>` itself can't scroll.
2. **Memphis frame** sits on the wrapper so it stays consistent with
   the lib's other containers.

`caption-bottom` puts caption beneath the table.

### TableHeader (inverted)

```
bg-foreground text-background
[&_tr]:border-b [&_tr]:border-memphis
```

The header is a hard slab (foreground/background inversion). The
nested selector `[&_tr]` applies a Memphis bottom border to any `<tr>`
inside, so multi-row headers stay separated.

### TableHead

```
h-11 px-4 text-left align-middle
font-mono text-xs font-semibold uppercase tracking-wider
```

Mono uppercase — same micro-typography as `Label`, `SelectLabel`,
ContextMenuLabel. Reads as "column title" unambiguously.

### TableRow — no default hover

The source comment is explicit:

> No default hover effect — tables aren't always clickable, and the
> hover tint was bleeding into the header row in particular.
> Consumers that render interactive rows can re-add `hover:bg-muted`
> via className.

```
border-b border-border transition-colors
data-[state=selected]:bg-muted
```

The selection highlight is preserved. Add `hover:bg-muted` per-row
for clickable tables.

### TableBody — last row no border

```
[&_tr:last-child]:border-0
```

Removes the bottom border from the last row so the table doesn't
double-up against the footer or the wrapper edge.

### TableFooter

```
bg-muted font-semibold border-t-2 border-memphis
```

Muted background, semibold typography, 2px Memphis top rule —
visually heavier than body separators.

## Notes & gotchas

1. **No default row hover** — see TableRow note. Add per-table.

2. **Wrapper `<div>` is automatic.** Consumers don't write a
   wrapping div around `<Table>` — Table provides it.

3. **`overflow-x-auto`** lets wide tables scroll horizontally inside
   the wrapper. For "freeze first column" / "freeze header" behaviors,
   compose with `position: sticky` cells.

4. **No sort indicators, no resizer, no pagination.** This is a
   semantic + visual table primitive only. Use TanStack Table or
   similar for behavior; the lib's components are the rendering
   layer.

5. **`data-state="selected"`** is the Radix convention; the lib
   honors it but doesn't drive it. A consumer using TanStack Table
   sets the attribute themselves.

## How to consume (shadcn-style copy)

Single-folder copy. No external deps. All native HTML.

## Open questions

1. **No optional row-hover variant.** A `<TableRow interactive>` axis
   would be useful for clickable rows.
2. **No striped rows variant.** Consumers add via
   `[&:nth-child(even)]:bg-muted/50` per-table.
3. **No "column-header sortable" pattern** — needs a dedicated
   `TableSortHead` with chevron and aria-sort.
