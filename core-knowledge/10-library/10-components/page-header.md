# PageHeader

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/page-header/{page-header.tsx,index.ts}`.

## Summary

Per-page heading composition: optional eyebrow + required title +
optional description + optional actions. Renders `<header>` with a
bottom border that separates the title block from the page body.
Responsive: stacks vertically on mobile, splits title-left /
actions-right on desktop.

## Public API

| Export            | Kind                                          |
| ----------------- | --------------------------------------------- |
| `PageHeader`      | `forwardRef<HTMLDivElement, PageHeaderProps>` |
| `PageHeaderProps` | see below                                     |

| Prop          | Type                                            | Notes                                                             |
| ------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `title`       | `ReactNode`                                     | required — renders as `<h1>`                                      |
| `eyebrow`     | `ReactNode`                                     | optional — uses `.eyebrow` typography                             |
| `description` | `ReactNode`                                     | optional — small muted paragraph                                  |
| `actions`     | `ReactNode`                                     | optional — right-aligned slot                                     |
| `className`   | `string`                                        | merged onto `<header>`                                            |
| …native       | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | `title` omitted because the prop conflicts with the DOM attribute |

## Internal architecture

```jsx
<header className={
  flex flex-col gap-3 pb-5 mb-8
  border-b border-border
  md:flex-row md:items-end md:justify-between md:gap-8
}>
  <div className="flex flex-col gap-1 min-w-0">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h1 className="font-display text-4xl md:text-5xl leading-tight
                   tracking-wide text-foreground m-0">
      {title}
    </h1>
    {description && (
      <p className="text-muted-foreground text-base max-w-[60ch] m-0 mt-1">
        {description}
      </p>
    )}
  </div>
  {actions && <div className="flex gap-2 items-center shrink-0">{actions}</div>}
</header>
```

### Responsive behavior

- **<md (`<768px`)**: column layout. Title block stacks above actions.
- **≥md**: row layout, `items-end`, `justify-between`. Title block
  on the left, actions block on the right, both aligned to baseline.

### Typography

- **eyebrow**: uses the `.eyebrow` class from `globals.css` —
  uppercase mono 11px 0.22em tracking, `text-primary` color.
- **title**: `<h1>` with display font, `text-4xl` (mobile) →
  `text-5xl` (desktop), `tracking-wide`, `m-0`.
- **description**: `text-base text-muted-foreground` capped at
  `max-w-[60ch]` for readability.

## Notes & gotchas

1. **`title` prop conflicts with the DOM attribute.** The type
   omits `title` from the native attributes (`Omit<…, 'title'>`)
   so the prop is unambiguously the heading content.

2. **`<h1>`** is always rendered. PageHeader is intended as the
   page's primary heading. For sub-section headers, use
   plain `<h2>` etc.

3. **`mb-8` baked in.** Same convention as Hint — adds 32px
   bottom margin so the header naturally separates from page
   content. Override via className.

4. **`border-b border-border`** — soft 1px bottom rule, not the
   Memphis double rule. Page headers are subdued separators, not
   branded chrome.

5. **`actions` shrink-0** prevents long action stacks from
   compressing. If actions overflow on narrow viewports, they
   appear below the title block (column layout).

6. **`max-w-[60ch]`** on description limits line length for
   readability. If a longer line is intentional, override.

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--border`, `--muted-foreground`,
`--foreground`, `--font-display`, plus the `.eyebrow` class from
`globals.css` (or replace with Tailwind equivalents inline).

## Open questions

1. **`<h1>` is hard-coded.** Some pages have multiple PageHeaders
   (e.g. a parent page hosting a child block). A `headingLevel`
   prop or `as` polymorphic would help.
2. **`mb-8` margin baked in** — same convention as Hint. Either
   document as deliberate or remove for consistency with the
   broader "no implicit spacing" pattern.
3. **`max-w-[60ch]` on description** is opinionated. Could be a
   prop.
