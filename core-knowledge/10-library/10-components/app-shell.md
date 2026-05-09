# AppShell

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/app-shell/{app-shell.tsx,index.ts}`.

## Summary

Two-column page-level layout: a sticky sidebar on the left and the
main content on the right. Configurable sidebar width and tone.
Distinct from the standalone `Sidebar` component — AppShell is the
**outer** layout that hosts a sidebar slot; `Sidebar` is the styled
panel typically rendered into that slot.

## Public API

| Export          | Kind                                        |
| --------------- | ------------------------------------------- |
| `AppShell`      | `forwardRef<HTMLDivElement, AppShellProps>` |
| `AppShellProps` | see below                                   |

| Prop           | Type                             | Default     | Notes                                                       |
| -------------- | -------------------------------- | ----------- | ----------------------------------------------------------- |
| `sidebar`      | `ReactNode`                      | (required)  | Rendered into the left column                               |
| `sidebarWidth` | `number`                         | `240`       | px                                                          |
| `sidebarTone`  | `'default' \| 'onDark'`          | `'default'` | `'onDark'` flips sidebar to `bg-foreground text-background` |
| `className`    | `string`                         | —           | Applied to outer grid                                       |
| …native        | `HTMLAttributes<HTMLDivElement>` | —           |                                                             |

Children render into the `<main>` slot (right column).

## Internal architecture

```jsx
<div className="grid min-h-screen"
     style={{ gridTemplateColumns: `${sidebarWidth}px 1fr` }}>
  <aside className={
    sticky top-0 h-screen flex flex-col gap-1 p-4
    + (onDark
        ? 'bg-foreground text-background'
        : 'bg-card text-foreground border-r border-border')
  }>{sidebar}</aside>
  <main className="min-w-0 overflow-x-hidden">{children}</main>
</div>
```

Three details:

1. **Grid columns set inline via `style`** — `gridTemplateColumns`
   uses the `sidebarWidth` prop directly. Couldn't be done via
   Tailwind because the value is dynamic per-instance.

2. **Sidebar is `position: sticky`, full viewport height.** The
   sidebar scrolls with the page until the page reaches the top, then
   stays anchored.

3. **`min-w-0 overflow-x-hidden` on `<main>`** prevents long content
   (wide tables, code blocks) from forcing the grid column wider than
   intended. The grid layout normally lets columns expand to fit
   content; `min-w-0` resets the implicit `min-width: auto`.

### Two tones

- **`default`**: `bg-card text-foreground border-r border-border` —
  blends with the page, separated by a 1px subtle right border.
- **`onDark`**: `bg-foreground text-background` — inverted, dark
  panel. Pairs with `--nav-on-dark-*` tokens for nav items inside
  (see theming chapter).

## Notes & gotchas

1. **Always two columns.** No "no sidebar" mode. For pages without a
   sidebar, don't use AppShell.

2. **`sidebarWidth` is in px** (numeric). For responsive widths or
   `clamp()` expressions, override `style.gridTemplateColumns`
   externally.

3. **No mobile collapse.** AppShell is desktop-first; sidebar
   doesn't collapse to a drawer on small viewports. Consumers
   needing a mobile pattern wrap the sidebar in a media query
   externally (or use `<Drawer>` + AppTopBar's `nav` prop).

4. **AppShell ≠ Sidebar.** The `sidebar` prop accepts any ReactNode
   — typically `<Sidebar>` from the lib, but a consumer can pass
   any layout (a custom nav, a tree view, etc.).

5. **`<aside>` semantics** for the sidebar slot, `<main>` for the
   content. Don't wrap the children in an extra `<main>`.

## How to consume (shadcn-style copy)

Single-folder copy. No external deps. The only token references
are `--card`, `--foreground`, `--background`, `--border`.

## Open questions

1. **No mobile collapse.** A "collapsed: drawer below md" mode would
   align with common app shells. Today consumers compose externally.
2. **Sidebar slot is required.** A `sidebar?: ReactNode` would let
   AppShell degrade to a single-column layout — though arguably
   that's not AppShell's job.
3. **`sidebarTone` axis mirrors the lib's nav-on-dark token set** but
   doesn't enforce or recommend pairing — consumers wiring a dark
   sidebar still need to remember the `--nav-on-dark-*` tokens
   manually.
