# Drawer

Status: documented · Last scan: 27c8471 · Sources:
`packages/ui/src/components/drawer/{drawer.tsx,index.ts,drawer.test.tsx}`.

## Summary

Edge-anchored panel built on `@radix-ui/react-dialog` (yes, Dialog —
Radix doesn't ship a separate Drawer primitive). Slides in from one of
four sides (right by default), full-height/width on its anchored axis,
constrained to a sensible cap on the other (`max-w-md` for left/right,
`max-h-[75vh]` for top/bottom). Same Memphis idiom as Dialog. Adds a
`DrawerBody` segment with `overflow-auto` so long content scrolls
inside the panel rather than the page.

## Public API

10 exports. Most mirror Dialog's structure — for any concept shared
with Dialog (overlay, header conventions, X button, animation
classes, missing `tailwindcss-animate`), see the Dialog chapter.

| Export              | Pass-through to                                     |
| ------------------- | --------------------------------------------------- |
| `Drawer`            | `DialogPrimitive.Root`                              |
| `DrawerTrigger`     | `DialogPrimitive.Trigger`                           |
| `DrawerPortal`      | `DialogPrimitive.Portal`                            |
| `DrawerClose`       | `DialogPrimitive.Close`                             |
| `DrawerOverlay`     | styled — same as DialogOverlay (`bg-foreground/40`) |
| `DrawerContent`     | styled — edge-anchored panel                        |
| `DrawerHeader`      | layout div — `pr-8 border-b border-border pb-3`     |
| `DrawerBody`        | layout div — `flex-1 overflow-auto py-3`            |
| `DrawerFooter`      | layout div — `border-t border-border pt-3 …`        |
| `DrawerTitle`       | styled — display font, large                        |
| `DrawerDescription` | styled — small muted text                           |

### `DrawerContentProps`

| Prop        | Type                                     | Default   |
| ----------- | ---------------------------------------- | --------- |
| `side`      | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| `hideClose` | `boolean`                                | —         |

## Internal architecture

### Side-driven layout (CVA)

`drawerContentVariants` is a `cva` with one `side` axis. Each side
variant sets:

1. **Anchor and dimensions:**
   - `right`: `right-0 top-0 h-full w-full max-w-md`
   - `left`: `left-0 top-0 h-full w-full max-w-md`
   - `top`: `top-0 left-0 w-full max-h-[75vh]`
   - `bottom`: `bottom-0 left-0 w-full max-h-[75vh]`

2. **Border edge:** Memphis border applies only on the side facing
   into the page:
   - right → `border-l-2 border-y-0 border-r-0`
   - left → `border-r-2 border-y-0 border-l-0`
   - top → `border-b-2 border-x-0 border-t-0`
   - bottom → `border-t-2 border-x-0 border-b-0`

3. **Slide animation:**
   `data-[state=open]:slide-in-from-{right|left|top|bottom}` and the
   matching `slide-out-to-*` on close.

### Three-segment body (Header / Body / Footer)

Drawer adds **DrawerBody** to the Dialog pattern:

```
<DrawerHeader>          ← border-b pb-3, fixed
<DrawerBody>            ← flex-1 overflow-auto, scrolls
<DrawerFooter>          ← border-t pt-3, fixed
```

`flex-1 overflow-auto` keeps the body scrollable while header/footer
stay anchored. Without `DrawerBody`, long content forces the entire
panel to scroll, hiding the footer.

### X button

Same as Dialog (`absolute right-3 top-3`, 32×32, hover muted). Toggled
by `hideClose`; **always present unless explicitly hidden** — Drawer
has no `severity` axis to suppress it.

## Notes & gotchas

1. **Built on `DialogPrimitive`, not `react-day-picker` or a separate
   Drawer lib.** The Radix Dialog primitive handles all the
   focus-trap, scroll-lock, and close behavior. The Drawer just
   restyles the Content.

2. **No `severity="alert"` analog.** Drawers are not modal commitment
   surfaces; if you need an alert, use Dialog. To prevent dismissal,
   override `onPointerDownOutside`/`onEscapeKeyDown` manually.

3. **`max-h-[75vh]` on top/bottom drawers** caps height so they don't
   cover the whole viewport; left/right use `h-full`. If a top drawer
   needs a different cap, override via `className`.

4. **`max-w-md`** (28rem) on left/right drawers. Wider drawers
   override via `className="max-w-2xl"` etc.

5. **Animation requires `tailwindcss-animate`** — see Dialog chapter
   Open questions.

## How to consume (shadcn-style copy)

1. Copy `drawer.tsx` and `index.ts`.
2. Add `@radix-ui/react-dialog` and `tailwindcss-animate`.
3. Replace `CloseIcon` import.

## Open questions

1. Inherits Dialog's open question for missing `tailwindcss-animate`.
   The close `aria-label` is now locale-aware via
   `useI18n().drawer.closeLabel` (resolved in PR #69).
2. **No `size` axis on top/bottom drawers** beyond the 75vh cap.
   Consumers might want `size: 'sm' | 'md' | 'lg'` for sliding sheets
   that aren't full-width on top/bottom.
3. **DrawerBody is optional** — there's no enforcement that consumers
   include it, so a long-content drawer without DrawerBody scrolls
   wrong silently. Consider documenting more loudly or providing a
   higher-level `<DrawerLayout>` wrapper.
