# Sidebar

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/sidebar/{sidebar.tsx,sidebar.variants.ts,index.ts,sidebar.test.tsx}`.

## Summary

Compound vertical panel with Memphis chrome, designed as the **canvas**
inside AppShell's sidebar slot (or any equivalent column layout). Five
exports compose Header / Brand / Subtitle / Body / Footer regions.
Sticky-by-default below the AppTopBar's `--header-height`. Body
scrolls; footer sticks to the bottom.

## Public API

| Export            | Kind                                    |
| ----------------- | --------------------------------------- |
| `Sidebar`         | `forwardRef<HTMLElement, SidebarProps>` |
| `SidebarHeader`   | layout div                              |
| `SidebarBrand`    | display-font heading                    |
| `SidebarSubtitle` | mono uppercase eyebrow                  |
| `SidebarBody`     | scrollable region                       |
| `SidebarFooter`   | bottom-stuck region with top border     |
| `SidebarProps`    | see below                               |
| `sidebarVariants` | (re-exported via index)                 |
| `SidebarVariants` | type                                    |

| `SidebarProps` | Type                                            | Default   |
| -------------- | ----------------------------------------------- | --------- |
| `sticky`       | `boolean`                                       | `true`    |
| `border`       | `'right' \| 'left' \| 'none'`                   | `'right'` |
| `width`        | `number \| string`                              | —         |
| `className`    | `string`                                        | —         |
| …native        | `Omit<HTMLAttributes<HTMLElement>, 'children'>` | —         |

## Internal architecture

### Sidebar root (cva)

```
base: flex flex-col gap-5
      px-5 py-8
      bg-muted text-foreground
      overflow-hidden

sticky.true:  sticky top-[var(--header-height)]
              h-[calc(100vh-var(--header-height))]
              self-start
border.right: border-r-2 border-memphis
border.left:  border-l-2 border-memphis
border.none:  (no border)
```

Two parts of this are load-bearing:

1. **`top-[var(--header-height)]`** — the sidebar pins below the
   AppTopBar (when sticky). Couples Sidebar to AppTopBar's
   `--header-height` token; changing the header height adjusts
   sidebar pinning automatically.

2. **`self-start`** — needed when sticky is true and Sidebar lives
   inside a flex/grid layout. Without it, the sidebar stretches
   vertically in some grid configurations and the sticky behavior
   breaks.

### Width handling

```ts
const widthStyle =
  width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : undefined
```

Number → pixel string. String → passed verbatim (so consumers can
pass `'16rem'`, `'min(280px, 25vw)'`, etc.). Width is set inline via
`style` (not Tailwind) because it's per-instance.

### Compound parts

| Part              | Classes                                                         |
| ----------------- | --------------------------------------------------------------- |
| `SidebarHeader`   | `flex flex-col gap-1`                                           |
| `SidebarBrand`    | `font-display text-lg tracking-[0.12em] text-primary`           |
| `SidebarSubtitle` | `font-mono text-[10px] tracking-[0.2em] uppercase text-primary` |
| `SidebarBody`     | `flex-1 min-h-0 overflow-y-auto pr-3`                           |
| `SidebarFooter`   | `mt-auto pt-5 border-t-2 border-memphis flex flex-col gap-3`    |

`SidebarBody`'s `flex-1 min-h-0 overflow-y-auto` is what makes the
scroll work: the body grows to fill remaining vertical space, but
`min-h-0` allows it to shrink below its natural height so the
overflow scrolls inside it instead of pushing the footer off-screen.
This is the same pattern used in DrawerBody.

## Notes & gotchas

1. **Sticky positioning depends on the parent layout.** Sidebar uses
   `position: sticky`, which only works if the parent isn't
   `overflow: hidden` (and has its own height). AppShell's grid
   layout satisfies this; an arbitrary flex container may not.

2. **`bg-muted` background** — not `bg-card` (that's AppTopBar) and
   not `bg-foreground` (that would be the dark sidebar variant).
   For dark sidebars, override `bg-muted` to `bg-foreground` and
   pair with the `--nav-on-dark-*` tokens.

3. **`self-start` matters in sticky mode.** Don't strip — the sidebar
   stretches if the parent is a flex row.

4. **Header / Brand / Subtitle are typography only** — they don't
   add layout beyond the gap-1 stack. A sidebar header can also be
   a fully custom node.

5. **Body uses `pr-3`** to keep the scrollbar from sitting flush
   against the right edge of the panel. If using Damo's
   `<ScrollArea>` instead, drop the `pr-3`.

6. **Footer's `mt-auto`** pushes it to the bottom of the flex column
   regardless of body content height.

## How to consume (shadcn-style copy)

1. Copy `sidebar.tsx`, `sidebar.variants.ts`, `index.ts`.
2. Tokens needed: `--muted`, `--foreground`, `--memphis-border-color`,
   `--header-height`, `--primary` (Brand/Subtitle text).
3. The `sticky top-[var(--header-height)]` couples to AppTopBar — if
   the consumer doesn't ship a header, change to `top-0`.

## Open questions

1. **No collapsed/icon-only mode.** Many app shells have a "collapse"
   toggle that shrinks the sidebar to icons. Today consumers compose
   externally with width state.
2. **`SidebarBrand` and `SidebarSubtitle` are tightly themed**
   (`text-primary`, font tokens). For dark-mode consumers using
   `--nav-on-dark-*`, they need to pass `className` overrides.
3. **`pr-3` on body** is a thumb-room hack rather than a proper
   scrollbar gutter. Could be replaced with a `scrollbar-gutter:
stable` declaration once support is broad.
4. **No "section" sub-component.** Multi-section sidebars (with
   in-body uppercase group titles) compose manually with `<Label>`
   or eyebrow spans.
