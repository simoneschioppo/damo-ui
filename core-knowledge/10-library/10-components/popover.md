# Popover

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/popover/{popover.tsx,index.ts,popover.test.tsx}`.

## Summary

Wrapper around `@radix-ui/react-popover` with the lib's Memphis
chrome (border + 6px Memphis shadow). 5 exports, only `PopoverContent`
is styled; the rest pass through Radix unchanged. Used as the
substrate for Combobox and DatePicker (and for any consumer-built
inline overlay).

## Public API

| Export           | Pass-through to                  |
| ---------------- | -------------------------------- |
| `Popover`        | `PopoverPrimitive.Root`          |
| `PopoverTrigger` | `PopoverPrimitive.Trigger`       |
| `PopoverAnchor`  | `PopoverPrimitive.Anchor`        |
| `PopoverClose`   | `PopoverPrimitive.Close`         |
| `PopoverContent` | styled — Portal + Memphis chrome |

`PopoverContent` props are Radix's `Content` (`align`, `side`,
`sideOffset`, `forceMount`, `onOpenAutoFocus`, etc.) with two lib
defaults:

| Prop         | Default    |
| ------------ | ---------- |
| `align`      | `'center'` |
| `sideOffset` | `6`        |

## Internal architecture

### `PopoverContent` styling

```
z-dropdown bg-popover text-popover-foreground
border-2 border-memphis shadow-memphis rounded-none
p-3 outline-none
data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
```

z-index = `--z-dropdown` (300). Same Memphis idiom as DropdownMenu and
the Select content — the comment in source explicitly calls this out:
"same border + offset shadow language as DropdownMenu / Dialog so
popovers feel consistent".

### `forceMount` propagated to BOTH Portal and Content

```ts
const portalForceMount = forceMount ? { forceMount: true as const } : null
return (
  <PopoverPrimitive.Portal {...portalForceMount}>
    <PopoverPrimitive.Content forceMount={forceMount} ... />
  </PopoverPrimitive.Portal>
)
```

This is **load-bearing**. The source comment explains: when the
consumer asks for `forceMount`, both layers must keep the subtree
mounted. Without `forceMount` on the **Portal**, Radix unmounts the
Portal subtree on close — children that need to mount on first paint
(e.g. an `AttrToggleGroup` whose persistence hook runs on mount) would
never run until the popover opens.

This is the only Radix wrapper in the lib that hand-propagates a
prop across two Radix layers. Don't simplify by passing `forceMount`
only to `Content` — verified to break in the lib's own use cases.

## Notes & gotchas

1. **`forceMount` propagates to Portal** — see above. Removing this
   breaks AttrToggleGroup's first-paint persistence sync, and
   anything similar.

2. **Animation requires `tailwindcss-animate`** — see Dialog chapter
   Open questions.

3. **`p-3` default padding.** Combobox and DatePicker override
   (`p-0` and `p-2` respectively) for content that brings its own
   padding. If the consumer renders a form inside, `p-3` is a
   reasonable starting padding.

4. **Trigger is unstyled** — consumers wrap a `<Button>` (typically
   with `asChild`) or render any element. Combobox and DatePicker
   render bare `<button>` elements with the lib's Memphis trigger
   styling.

## How to consume (shadcn-style copy)

1. Copy `popover.tsx` and `index.ts`.
2. Add `@radix-ui/react-popover` + `tailwindcss-animate`.
3. Tokens: `--popover` / `--popover-foreground`, `--memphis-border-color`,
   `--shadow-memphis`, `--z-dropdown`.

## Open questions

1. **`forceMount` plumbing** is non-obvious — worth a JSDoc note on
   the export so future maintainers don't simplify.
2. Inherits the lib-wide `tailwindcss-animate` open question.
