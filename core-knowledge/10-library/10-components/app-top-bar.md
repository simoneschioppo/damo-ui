# AppTopBar

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/app-top-bar/{app-top-bar.tsx,index.ts,app-top-bar.test.tsx}`.

## Summary

Site-level header: logo + optional nav + optional actions slots,
arranged with `justify-between`. Sticky-by-default with the lib's
`--header-height` token driving its height. Memphis-styled (thick
black bottom border on `bg-card`).

## Public API

| Export          | Kind |
|-----------------|------|
| `AppTopBar`     | `forwardRef<HTMLElement, AppTopBarProps>` |
| `AppTopBarProps`| see below |

| Prop      | Type                          | Default   | Notes |
|-----------|-------------------------------|-----------|-------|
| `logo`    | `ReactNode`                   | (required) | Rendered in display font, `text-xl tracking-wider` |
| `nav`     | `ReactNode`                   | —         | Wrapped in `<nav className="flex gap-6">` |
| `actions` | `ReactNode`                   | —         | Wrapped in `<div className="flex gap-4 items-center flex-wrap">` |
| `sticky`  | `boolean`                     | `true`    | When false, the header is in normal flow |
| `className`| `string`                     | —         | |
| …native   | `HTMLAttributes<HTMLElement>` | —         | |

## Internal architecture

```jsx
<header className={
  flex items-center justify-between gap-6 flex-wrap px-6
  h-[var(--header-height)] min-h-[var(--header-height)]
  border-b-2 border-memphis bg-card text-foreground
  + (sticky && 'sticky top-0 z-header')
}>
  <div className="font-display text-xl tracking-wider">{logo}</div>
  {nav      && <nav className="flex gap-6">{nav}</nav>}
  {actions  && <div className="flex gap-4 items-center flex-wrap">{actions}</div>}
</header>
```

Key bindings:

- **Height token**: `--header-height` (56px default in `tokens.css`).
  Both `h-` and `min-h-` are set so the header doesn't collapse if
  contents are shorter or get hidden.
- **z-index**: `--z-header` (200) when sticky — below
  `--z-dropdown` (300) so dropdowns triggered from the header stack
  above it.
- **`flex-wrap`** allows actions to wrap onto a second line if the
  viewport is narrow.

### Slot rendering guards

```ts
{nav !== undefined && nav !== null && <nav…>{nav}</nav>}
{actions !== undefined && actions !== null && <div…>{actions}</div>}
```

The `!== undefined && !== null` guards (instead of `nav && …`) avoid
rendering an empty nav/actions wrapper when the consumer passes
`false` or `0` (rare but possible). Less defensive than
`!= null` but explicit.

## Notes & gotchas

1. **`logo` is required, others are optional.** A bare logo-only
   header is supported.

2. **Sidebar in AppShell uses `top-[var(--header-height)]`** to sit
   below this top bar. If you change `--header-height`, the Sidebar's
   sticky position adjusts automatically.

3. **No mobile collapse for `nav`.** `flex-wrap` lets the row break
   onto a second line, which is acceptable for short nav lists. For
   true mobile menus, render a Drawer trigger inside `actions`.

4. **`bg-card`** as background — not `bg-background`. The header is
   visually a card-like surface above the page background.

5. **`text-foreground` is set explicitly** so consumer text inside the
   header (logo, nav links) inherits the foreground color regardless
   of the surrounding context.

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--header-height`, `--card`,
`--foreground`, `--memphis-border-color`, `--z-header`.

## Open questions

1. **No mobile menu pattern.** Consumers wire their own
   Drawer/Sheet via the `actions` slot. A documented "mobile nav
   recipe" would help.
2. **`logo` is `font-display text-xl tracking-wider`** by default
   inside the wrapper div, but a consumer passing a styled `<Link>`
   ends up with double-styling (the wrapper's font-display fights
   any inline override). Worth documenting the layering.
3. **`flex-wrap` on the root** means a wide nav + actions pushes
   actions onto a second line, breaking the visual horizon. Ideal
   for fluid behavior, surprising for first-time users.
