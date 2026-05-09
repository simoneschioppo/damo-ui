# ContextMenu

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/context-menu/{context-menu.tsx,index.ts,context-menu.test.tsx}`.

## Summary

Right-click menu wrapper around `@radix-ui/react-context-menu`. Same
shape as DropdownMenu (11 exports) **but visually softer**:
`border border-border` (1px, not 2px Memphis), `shadow-md` (soft
tier, not Memphis), `rounded-md` (corners, not hard `rounded-none`).
This is the lib's "OS-native context menu" feel — distinct from the
heavier DropdownMenu which functions as a designed menu surface.

## Public API

11 exports, mirroring DropdownMenu's surface:

| Export                    | Pass-through to                   | Styled?                   |
| ------------------------- | --------------------------------- | ------------------------- |
| `ContextMenu`             | `ContextMenuPrimitive.Root`       | no                        |
| `ContextMenuTrigger`      | `ContextMenuPrimitive.Trigger`    | no                        |
| `ContextMenuGroup`        | `ContextMenuPrimitive.Group`      | no                        |
| `ContextMenuPortal`       | `ContextMenuPrimitive.Portal`     | no                        |
| `ContextMenuSub`          | `ContextMenuPrimitive.Sub`        | no                        |
| `ContextMenuRadioGroup`   | `ContextMenuPrimitive.RadioGroup` | no                        |
| `ContextMenuContent`      | `…Content`                        | yes — soft panel          |
| `ContextMenuItem`         | `…Item`                           | yes                       |
| `ContextMenuCheckboxItem` | `…CheckboxItem`                   | yes                       |
| `ContextMenuRadioItem`    | `…RadioItem`                      | yes — small dot indicator |
| `ContextMenuLabel`        | `…Label`                          | yes — uppercase muted     |
| `ContextMenuSeparator`    | `…Separator`                      | yes — `bg-border`         |
| `ContextMenuShortcut`     | plain `<span>`                    | yes                       |
| `ContextMenuSubTrigger`   | `…SubTrigger`                     | yes                       |
| `ContextMenuSubContent`   | `…SubContent`                     | yes                       |

Items, CheckboxItems, RadioItems, and SubTriggers accept the same
optional `inset?: boolean` prop as DropdownMenu.

## Internal architecture — divergence from DropdownMenu

This component is **deliberately not a copy** of DropdownMenu. The
visual axes differ:

| Concern          | DropdownMenu              | ContextMenu             |
| ---------------- | ------------------------- | ----------------------- |
| Content border   | `border-2 border-memphis` | `border border-border`  |
| Content shadow   | `shadow-memphis`          | `shadow-md`             |
| Content radius   | `rounded-none`            | `rounded-md`            |
| Content padding  | `p-2`                     | `p-1`                   |
| Item radius      | `rounded-none`            | `rounded-sm`            |
| Item hover       | `bg-foreground/5`         | `bg-muted`              |
| RadioItem chrome | Gradient + outline + bar  | Small dot indicator     |
| Label color      | `text-primary`            | `text-muted-foreground` |
| Separator bg     | `bg-memphis`              | `bg-border`             |

Reading: ContextMenu = neutral OS-style; DropdownMenu = decorated app
menu.

### Item

```
relative flex cursor-pointer select-none items-center gap-2
px-2 py-1.5 text-sm rounded-sm outline-none
focus:bg-muted focus:text-foreground
data-[disabled]:pointer-events-none data-[disabled]:opacity-50
```

### RadioItem indicator

```jsx
<span className="absolute left-2 flex h-4 w-4 items-center justify-center">
  <ContextMenuPrimitive.ItemIndicator>
    <span className="h-2 w-2 rounded-full bg-secondary" />
  </ContextMenuPrimitive.ItemIndicator>
</span>
```

A simple 8×8 secondary-colored dot — much lighter than DropdownMenu's
selection chrome (gradient + outline + bar). Keeps the "OS-native"
feel.

### Label

`px-2 py-1.5 text-xs font-semibold uppercase tracking-wider
text-muted-foreground` — same as the lib's standalone `Label` and
`SelectLabel`, **muted**, not primary like DropdownMenu's.

### SubTrigger

Reuses Item base classes plus `data-[state=open]:bg-muted` (muted
slab when sub-menu open) — softer than DropdownMenu's secondary fill.

## Notes & gotchas

1. **Trigger is a region, not a button.** `ContextMenuTrigger` wraps
   any element; right-clicking inside it opens the menu. Default
   browser context menu is suppressed inside the trigger area.

2. **No Memphis idiom on the panel** — by design. Don't add it back
   to "match" DropdownMenu; the visual divergence is intentional.

3. **No animation classes are wired** in source — checked: no
   `data-[state=open]:animate-in`. ContextMenus appear/disappear
   without entrance animations. Different from every other overlay
   in the lib. (If consistent animation is desired, see Open
   questions.)

4. **`content-menu` shortcut typography** mirrors DropdownMenu —
   `ml-auto text-xs text-muted-foreground font-mono tracking-wider`.

5. **`shadow-md` instead of Memphis** — soft tier shadow tokenized in
   the theming chapter. Used here, in Tooltip, and on Card-elevated.

## How to consume (shadcn-style copy)

1. Copy `context-menu.tsx` and `index.ts`.
2. Add `@radix-ui/react-context-menu`.
3. Replace `CheckIcon` and `ChevronRightIcon` imports.
4. Tokens: `--popover` / `--popover-foreground`, `--border`,
   `--secondary` (radio dot), `--shadow-md`, `--muted`, `--z-dropdown`.

## Open questions

1. **No entrance/exit animations.** All other overlays animate;
   ContextMenu doesn't. Consistent or sloppy? Document the design
   choice or align with the rest of the system.
2. **Cross-component RadioItem inconsistency.** DropdownMenu has the
   "selection chrome" recipe; ContextMenu has a small dot. Different
   on purpose, but worth documenting somewhere central.
3. The 11-export surface duplicates DropdownMenu's surface verbatim
   (parts list). Worth a shared "menu items" base file once a third
   menu primitive lands.
