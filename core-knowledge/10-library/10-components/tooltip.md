# Tooltip

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/tooltip/{tooltip.tsx,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-tooltip`. 4 exports following Radix's
shape. **Visually inverted** — black panel with white text — using
`bg-foreground text-background`, with the soft `shadow-md` elevation
(not the Memphis shadow stack). The only overlay component in the
lib that intentionally drops the Memphis idiom; tooltips are meant
to be quiet, peripheral chrome.

## Public API

| Export             | Pass-through to                          |
|--------------------|------------------------------------------|
| `TooltipProvider`  | `TooltipPrimitive.Provider`              |
| `Tooltip`          | `TooltipPrimitive.Root`                  |
| `TooltipTrigger`   | `TooltipPrimitive.Trigger`               |
| `TooltipContent`   | styled — Portal + inverted panel         |

The consumer **must** wrap their app in `<TooltipProvider>` (typically
once, at the layout root) for any Tooltip to work. This is Radix's
contract — the lib doesn't change it.

`TooltipContent` props are Radix's, with one default:

| Prop         | Default |
|--------------|---------|
| `sideOffset` | `4`     |

## Internal architecture

### `TooltipContent` styling

```
z-tooltip bg-foreground text-background
border border-border-strong rounded-md shadow-md
px-2 py-1 text-xs font-semibold
data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0
data-[state=closed]:animate-out data-[state=closed]:fade-out-0
```

Three deliberate deviations from the lib's overlay convention:

1. **`bg-foreground text-background`** — inverted instead of
   `bg-popover text-popover-foreground`. Tooltips read as "small
   contrasting badge" rather than "modal panel".
2. **`border border-border-strong`** (1px, not 2px) — light border,
   not the Memphis 2px black.
3. **`rounded-md`** (not `rounded-none`) and **`shadow-md`** (soft
   tier, not Memphis stack) — soft elevation, soft corners.

z-index = `--z-tooltip` (700) — the highest tier in the system, above
toasts (600), modals (500), and overlays (400). Tooltips are always
on top.

### `data-[state=delayed-open]` (not `data-[state=open]`)

Radix Tooltip uses `delayed-open` for the entrance state (after the
hover delay elapses). Animations are wired to that, not to plain
`open`. Don't change to `data-[state=open]` — it won't trigger.

## Notes & gotchas

1. **`TooltipProvider` is required at app root.** Forgetting it
   silently breaks tooltips (no error, just no popover). The Radix
   default delay is 700ms before the tooltip appears. Override via
   `<TooltipProvider delayDuration={…}>`.

2. **Inverted color palette.** This is the only overlay that drops
   `bg-popover` for `bg-foreground`. Don't "fix" this for consistency
   — it's intentional design.

3. **Soft tier shadow (`shadow-md`)** — exception to the Memphis
   identity. Tooltips need to feel light and peripheral.

4. **Animation requires `tailwindcss-animate`** — see Dialog chapter
   Open questions.

5. **No `TooltipArrow` export.** Radix offers an optional pointer
   arrow; the lib doesn't re-export it. Consumers wanting an arrow
   import directly from Radix.

## How to consume (shadcn-style copy)

1. Copy `tooltip.tsx` and `index.ts`.
2. Add `@radix-ui/react-tooltip` + `tailwindcss-animate`.
3. Tokens: `--foreground`, `--background`, `--border-strong`,
   `--shadow-md`, `--z-tooltip`.
4. Don't forget to wire `<TooltipProvider>` at the app root.

## Open questions

1. **No `TooltipArrow`** — easy add for consumers who want the
   pointer.
2. **No size variant.** `text-xs px-2 py-1` is the only size. Long
   tooltips (rare but real) overflow.
3. Inherits the lib-wide `tailwindcss-animate` open question.
