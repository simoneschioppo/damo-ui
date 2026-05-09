# Breadcrumbs

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/breadcrumbs/{breadcrumbs.tsx,index.ts}`.

## Summary

Hand-rolled (no Radix) breadcrumb trail. `<Breadcrumbs>` lays out a
`<ol>` with auto-injected separators between children;
`<BreadcrumbItem>` renders either an `<a>` (with hover underline) or a
non-interactive `<span aria-current="page">` when `current` is true.

## Public API

| Export                | Kind                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `Breadcrumbs`         | `forwardRef<HTMLElement, BreadcrumbsProps>`                              |
| `BreadcrumbItem`      | `forwardRef<HTMLSpanElement, BreadcrumbItemProps>`                       |
| `BreadcrumbsProps`    | `HTMLAttributes<HTMLElement> & { separator?: ReactNode }`                |
| `BreadcrumbItemProps` | `HTMLAttributes<HTMLSpanElement> & { current?: boolean; href?: string }` |

| `BreadcrumbItemProps` | Type      | Default | Notes                                           |
| --------------------- | --------- | ------- | ----------------------------------------------- |
| `current`             | `boolean` | —       | When true, renders `<span aria-current="page">` |
| `href`                | `string`  | —       | Used on the `<a>` when not current              |
| `className`           | `string`  | —       |                                                 |

## Internal architecture

### Breadcrumbs root

```jsx
<nav aria-label="Breadcrumb">
  <ol className="flex flex-wrap items-center gap-1.5 text-sm">
    {Children.toArray(children)
      .filter(isValidElement)
      .map((child, idx, arr) => (
        <Fragment key={idx}>
          <li>{child}</li>
          {idx < arr.length - 1 && (
            <li role="presentation" aria-hidden>
              {sep}
            </li>
          )}
        </Fragment>
      ))}
  </ol>
</nav>
```

- Wraps each child in a `<li>`.
- Injects a separator `<li>` (decorative, `role="presentation"`,
  `aria-hidden`) between children — not after the last one.
- Default separator: `<ChevronRightIcon size={14} />`. Override via
  `separator` prop.

### BreadcrumbItem

Branches on `current`:

```jsx
if (current)
  return (
    <span aria-current="page" className="text-foreground font-semibold">
      {children}
    </span>
  )
else
  return (
    <a href={href} className="text-muted-foreground hover:text-foreground hover:underline …">
      {children}
    </a>
  )
```

- Current item: bold, foreground-colored, no underline, with
  `aria-current="page"` for assistive tech.
- Non-current: muted, hover underlines with `underline-offset-2`,
  standard focus ring.

The ref typing is forwarded with a cast in the `<a>` branch (`ref as
unknown as React.Ref<HTMLAnchorElement>`) because the
component-level type uses `HTMLSpanElement` (the current branch).

## Notes & gotchas

1. **Separators are auto-injected.** Don't pass separators as
   children — pass only items. The wrapper handles the connectors.

2. **`current` and `href` are conventionally exclusive.** A
   `current && href` pair would render the span branch (no link).
   Don't expect href to apply when current is true.

3. **Non-current items always render `<a href={href}>`** — a missing
   `href` results in `<a>` with no destination, which is technically
   invalid HTML. Always provide `href` for non-current items, or
   render a custom node.

4. **`Children.toArray(children).filter(isValidElement)`** — strings,
   numbers, and fragments are filtered out. Wrap text in
   `<BreadcrumbItem>` (or any element).

5. **No truncation on long trails.** A 7-level breadcrumb trail will
   wrap to multiple lines (`flex-wrap`). For "show first / last with
   `…` middle" UX, the consumer composes manually.

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--foreground`, `--muted-foreground`,
`--ring`. Replace `ChevronRightIcon` import.

## Open questions

1. **Item is always `<a>` or `<span>`** — for `<Link>`-style routing
   integration (Next.js, React Router), consumers need to pass a
   custom child instead. An `as` prop on `BreadcrumbItem` would
   help.
2. **No truncation strategy.** A `truncate?: 'middle' | 'end'` axis
   would cover the long-trail UX.
3. **Separator slot accepts ReactNode** — but it's reused for every
   gap. No per-gap customization.
