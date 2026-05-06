# DropdownMenu

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/dropdown-menu/{dropdown-menu.tsx,index.ts,dropdown-menu.test.tsx}`.

## Summary

Compound-component wrapper around `@radix-ui/react-dropdown-menu` with
**11 exports** spanning the full Radix surface (Root, Trigger, Group,
Portal, Sub, RadioGroup, Content, Item, CheckboxItem, RadioItem, Label,
Separator, Shortcut, SubTrigger, SubContent). Memphis-styled content
panel; items use a soft tinted hover (`bg-foreground/5`) instead of the
solid slab the lib previously used. RadioItem has a distinctive
"selected chrome" — gradient + 1px inset outline + 3px left bar — that
mirrors the NavItem selection chrome for cross-component consistency.

## Public API

11 exports:

| Export                      | Pass-through to                               | Styled? |
|-----------------------------|-----------------------------------------------|---------|
| `DropdownMenu`              | `DropdownMenuPrimitive.Root`                  | no |
| `DropdownMenuTrigger`       | `DropdownMenuPrimitive.Trigger`               | no |
| `DropdownMenuGroup`         | `DropdownMenuPrimitive.Group`                 | no |
| `DropdownMenuPortal`        | `DropdownMenuPrimitive.Portal`                | no |
| `DropdownMenuSub`           | `DropdownMenuPrimitive.Sub`                   | no |
| `DropdownMenuRadioGroup`    | `DropdownMenuPrimitive.RadioGroup`            | no |
| `DropdownMenuContent`       | `…Content`                                    | yes — Memphis panel |
| `DropdownMenuItem`          | `…Item`                                       | yes — base item |
| `DropdownMenuCheckboxItem`  | `…CheckboxItem`                               | yes — left-padded check |
| `DropdownMenuRadioItem`     | `…RadioItem`                                  | yes — selected chrome (see below) |
| `DropdownMenuLabel`         | `…Label`                                      | yes — uppercase mono primary |
| `DropdownMenuSeparator`     | `…Separator`                                  | yes — `bg-memphis` (black) |
| `DropdownMenuShortcut`      | plain `<span>`                                | yes — right-aligned mono |
| `DropdownMenuSubTrigger`    | `…SubTrigger`                                 | yes — adds chevron |
| `DropdownMenuSubContent`    | `…SubContent`                                 | yes — Memphis panel |

Items, CheckboxItems, RadioItems, and SubTriggers accept an optional
`inset?: boolean` prop that adds `pl-8` to align with siblings that
have a left indicator.

## Internal architecture

### Item base class (shared)

```ts
const itemBaseClass = cn(
  'relative flex select-none items-center gap-2',
  'px-2.5 py-1.5 text-[13px] font-body font-medium rounded-none outline-none cursor-pointer',
  'transition-colors duration-snap ease-memphis',
  'focus:bg-foreground/5 focus:text-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)
```

The `focus:bg-foreground/5` (5% tint) replaces an earlier
`bg-secondary` solid slab. The source comment explains: "the slab
fought visually with the new outlined selection chrome on radio
items, and read as too aggressive even on plain Items where it was
originally intended for keyboard a11y only".

### `Content` panel

```
z-dropdown min-w-[10rem] overflow-hidden bg-popover text-popover-foreground
border-2 border-memphis rounded-none shadow-memphis
p-2
```

Same Memphis idiom as Popover (and Select content). Default `sideOffset`
overridden to **6** (lib default).

### CheckboxItem

Adds `pl-8 pr-2` and an absolute-positioned check icon at `left-2`
inside `ItemIndicator` (which only renders when `data-state=checked`).
14px CheckIcon.

### RadioItem — "selected chrome"

The lib's most decorative item state. When `data-[state=checked]`:

- Text → `text-foreground`
- Radius → `rounded-selection` (the 10px radius from tokens)
- Background → 135° gradient mixing 18% primary into transparent and
  10% secondary into transparent (subtle violet/secondary wash)
- Inset 1px outline shadow → 30% primary tinted
- `::before` 3px-wide left bar (`top-1.5 bottom-1.5 left-1`) in
  `bg-primary`, 2px-radius rounded

This **mirrors the NavItem selection chrome** so persistent selection
reads consistently across the library (sidebar entries, settings
menus, etc.). The source comment explicitly calls this out:
"Mirrors the NavItem selection chrome so persistent selection reads
consistently across the library".

The bar uses `left-1` (inset) instead of `left-0` (flush) because the
menu Content has `overflow-hidden` — a flush bar would be clipped.
NavItem uses a different inset because it's not inside an
overflow-clipped container.

### Label

```
px-2.5 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary
```

This is the lib's `.eyebrow` typography (10px mono uppercase 0.22em
tracking) but in `text-primary` color (saturated, not muted). Visually
heavier than the standalone `Label` component or the `SelectLabel`.

### Separator

`my-1.5 h-px bg-memphis` — uses `bg-memphis` (the Memphis border
color, black by default), not `bg-border`. **Bolder** than Select's
or ContextMenu's separators (which use `bg-border`).

### SubTrigger

Reuses `itemBaseClass` plus a `data-[state=open]` solid fill:
```
data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground
```

When the sub-menu is open, the SubTrigger gets a stronger highlight
(secondary slab) than the soft `focus:bg-foreground/5` — signals
"submenu is currently expanded".

### Shortcut

Plain `<span>`: `ml-auto text-xs text-muted-foreground font-mono
tracking-wider`. Used inline at the end of an Item to display
keyboard shortcut text (e.g. "⌘ K"). Not a Radix part — pure
typography.

## Notes & gotchas

1. **RadioItem selection chrome is decorative-heavy** — gradient +
   inset outline + left bar. Override via `className` with
   `data-[state=checked]:` overrides if you want a simpler look.
   Don't strip without considering visual parity with NavItem.

2. **Separator uses `bg-memphis`** (black), unlike Select's
   `bg-border` separator. Don't unify without a deliberate decision —
   the visual heaviness is part of the dropdown's identity.

3. **Label is in `text-primary`**, not `text-muted-foreground` like
   the standalone Label component. Reading it as "section title"
   not "form label".

4. **`focus:bg-foreground/5`** is a 5% tint — extremely soft. Some
   themes may render it nearly invisible. Don't push to 10–15% without
   re-evaluating the gradient on RadioItem.

5. **No `inset` enforcement.** Pass `inset` on items that need
   alignment with check/radio siblings. There's no auto-detection.

6. **Animation requires `tailwindcss-animate`** — see Dialog chapter
   Open questions.

## How to consume (shadcn-style copy)

1. Copy `dropdown-menu.tsx` and `index.ts`.
2. Add `@radix-ui/react-dropdown-menu` + `tailwindcss-animate`.
3. Replace `CheckIcon` and `ChevronRightIcon` imports.
4. Tokens: `--popover` / `--popover-foreground`, `--memphis-border-color`,
   `--shadow-memphis`, `--primary`, `--secondary`, `--radius-selection`,
   `--z-dropdown`.

## Open questions

1. **NavItem and DropdownMenuRadioItem share a "selection chrome"
   recipe** — gradient + 1px inset outline + 3px left bar. Worth
   extracting as a documented pattern (`selectionChrome()` helper or
   styled wrapper) so the two stay in sync if the design evolves.
2. **Label color (`text-primary`) is unusual for a label.** Some
   themes (low-contrast palettes) may have legibility issues.
3. **Separator's `bg-memphis`** divergence from Select / ContextMenu —
   document or unify.
4. Inherits the lib-wide `tailwindcss-animate` open question.
