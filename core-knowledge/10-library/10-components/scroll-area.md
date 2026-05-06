# ScrollArea

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/scroll-area/{scroll-area.tsx,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-scroll-area` providing a custom-styled
scrollbar that replaces the native browser one. Auto-renders both
vertical and horizontal scrollbars. Two exports: `ScrollArea` (the
viewport wrapper) and `ScrollBar` (re-exported for fine-grained
custom layouts).

## Public API

| Export           | Kind |
|------------------|------|
| `ScrollArea`     | `forwardRef<HTMLDivElement, ScrollAreaProps>` |
| `ScrollBar`      | `forwardRef<HTMLDivElement, ScrollBarProps>` |
| `ScrollAreaProps`| `ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>` |
| `ScrollBarProps` | `ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>` |

`ScrollArea` props are Radix's `Root` — notably `type` (`auto` |
`always` | `scroll` | `hover`), `scrollHideDelay`.

## Internal architecture

```
ScrollAreaPrimitive.Root              ← className: relative overflow-hidden
└── ScrollAreaPrimitive.Viewport      ← className: h-full w-full rounded-[inherit]
    └── {children}
└── ScrollBar orientation="vertical"
└── ScrollBar orientation="horizontal"
└── ScrollAreaPrimitive.Corner
```

`ScrollBar` is a forwardRef that styles `Scrollbar` + `Thumb`:

```
Scrollbar:
  flex touch-none select-none transition-colors
  vertical: h-full w-2.5 border-l border-l-transparent p-[1px]
  horizontal: h-2.5 flex-col border-t border-t-transparent p-[1px]

Thumb:
  relative flex-1 rounded-pill bg-border-strong
  hover:bg-ink-muted
  before:absolute before:inset-0 before:rounded-pill
```

## Notes & gotchas

1. **`hover:bg-ink-muted` does not resolve.** `--ink-muted` /
   `--color-ink-muted` is **not defined** in `tokens.css` or
   `theme.css`. Same lib-wide `--ink-*` issue flagged in the Dialog
   chapter Open question 1. Result: scrollbar thumb has no hover
   color change. Fix: switch to `hover:bg-muted-foreground` (or
   define `--ink-muted` in the consumer's theme).

2. **Both scrollbars are always rendered.** Even on a vertically-only
   scrolling area, the horizontal scrollbar exists in the DOM (Radix
   shows it conditionally based on overflow). For consumers who want
   only one axis, render `<ScrollAreaPrimitive.Root>` directly with
   one `<ScrollBar>` child.

3. **The native browser scrollbar is suppressed** because Radix
   measures and overlays its own. Mixing Damo's webkit-scrollbar
   styles (in `globals.css`) with `ScrollArea` is harmless — the
   native scrollbar is hidden.

4. **`p-[1px]` and the `border-l/t-transparent`** create a 1px gap
   between the thumb and the panel edge. Don't strip — the gap is
   visual breathing room.

5. **Children must not be `position: absolute`** (they'd escape the
   viewport). Wrap absolute children in a static-positioned container
   inside the viewport.

## How to consume (shadcn-style copy)

1. Copy `scroll-area.tsx` and `index.ts`.
2. Add `@radix-ui/react-scroll-area` as a runtime dep.
3. Replace `bg-ink-muted` with `bg-muted-foreground` (or define
   `--ink-muted` in the consumer's theme).
4. Tokens needed: `--border-strong`, the swap from `--ink-muted`
   above.

## Open questions

1. **`bg-ink-muted` broken** — see Notes #1. Inherits the lib-wide
   `--ink-*` cleanup task (Dialog Open question 1).
2. **Single-axis variant?** Many use cases want only vertical scroll
   — could expose `axis: 'both' | 'vertical' | 'horizontal'`.
