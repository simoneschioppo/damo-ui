# Select

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/select/{select.tsx,index.ts,select.test.tsx}`.

## Summary

Composable wrapper around `@radix-ui/react-select` exposing the full
Radix surface (Root / Group / Value / Trigger / Content / Portal /
Viewport / Item / ItemIndicator / Label / Separator / ScrollUp /
ScrollDown). Trigger uses the **same focus-shadow recipe as Input**
(primary-tinted Memphis shadow on focus). Content is portal-rendered,
hard-cornered, with the lib's signature heavy shadow.

## Public API

8 exports:

| Export                   | Pass-through to                      | Notes                                             |
| ------------------------ | ------------------------------------ | ------------------------------------------------- |
| `Select`                 | `SelectPrimitive.Root`               | Unstyled — controlled/uncontrolled selection root |
| `SelectGroup`            | `SelectPrimitive.Group`              | Unstyled — groups items                           |
| `SelectValue`            | `SelectPrimitive.Value`              | Unstyled — renders selected value text            |
| `SelectTrigger`          | `SelectPrimitive.Trigger`            | Styled — Memphis trigger with chevron             |
| `SelectContent`          | `SelectPrimitive.Portal` + `Content` | Styled — portal-rendered popover                  |
| `SelectLabel`            | `SelectPrimitive.Label`              | Styled — small uppercase mono label               |
| `SelectItem`             | `SelectPrimitive.Item`               | Styled — left-padded with check indicator         |
| `SelectScrollUpButton`   | `SelectPrimitive.ScrollUpButton`     | Styled — chevron-up scroll affordance             |
| `SelectScrollDownButton` | `SelectPrimitive.ScrollDownButton`   | Styled — chevron-down scroll affordance           |
| `SelectSeparator`        | `SelectPrimitive.Separator`          | Styled — `h-px bg-border my-1`                    |

Composition (canonical):

```tsx
<Select onValueChange={...}>
  <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Group title</SelectLabel>
      <SelectItem value="a">A</SelectItem>
      <SelectItem value="b">B</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## Internal architecture

### Trigger

```
inline-flex h-10 w-full items-center justify-between gap-2
px-3 py-2 text-base text-foreground
bg-card border-2 border-memphis rounded-none
transition-colors duration-fast cursor-pointer
hover:bg-muted
data-[placeholder]:text-muted-foreground
focus-visible:outline-none focus-visible:border-primary
  focus-visible:[--memphis-shadow-color:var(--primary)]
  focus-visible:shadow-memphis
disabled:opacity-50 disabled:pointer-events-none
```

Same focus shadow recipe as Input (see Input chapter). The trigger is
visually a "form field that opens a popover". Built-in chevron is the
lib's `ChevronDownIcon size={16}` rendered via `SelectPrimitive.Icon
asChild`.

`data-[placeholder]:text-muted-foreground` mutes the text when no value
is selected — Radix sets `data-placeholder` on the trigger when the
inner Value is showing the placeholder.

### Content (popover)

```
relative z-dropdown min-w-[8rem] overflow-hidden
bg-popover text-popover-foreground
border-2 border-memphis shadow-memphis rounded-none
data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1   (popper only)
```

Wrapped in `SelectPrimitive.Portal`. Uses `z-dropdown` from the lib's
z-index tokens (300). The 1px translate-y per side is a small breathing
gap from the trigger. `position` defaults to `'popper'`; alternative
is `'item-aligned'` (Radix's centered-on-selected mode).

The Viewport sets `min-w-[var(--radix-select-trigger-width)]` so the
popover stretches to the trigger's width when in popper mode — this is
a Radix CSS variable, not a Damo token.

### Item

```
relative flex w-full cursor-pointer select-none items-center
py-1.5 pl-8 pr-2 text-sm outline-none
focus:bg-muted focus:text-foreground
data-[state=checked]:font-semibold
data-[disabled]:pointer-events-none data-[disabled]:opacity-50
```

`pl-8` reserves 32px on the left for the indicator (`absolute left-2`,
4×4 box). `focus:bg-muted` is the keyboard-nav highlight (Radix moves
focus on arrow keys).

The selected item is visually marked **only** by font weight bump
(`data-[state=checked]:font-semibold`) plus the check icon — no
background change. This keeps the focused-item highlight (`bg-muted`)
unambiguous.

### Label

`px-2 py-1.5 text-xs font-semibold uppercase tracking-wider
text-muted-foreground`. Same micro-typography as the lib's `Label`
component — used as the title above an option group.

### Separator

`my-1 h-px bg-border` — a thin in-popover divider, similar to the
core Separator's `solid` variant.

### Scroll buttons

Both chevron-only, 14px icons, `cursor-default` (they activate by
hover/auto-scroll, not click). Rendered above/below the Viewport when
the content overflows.

## Notes & gotchas

1. **Many exports, one styled file.** Unlike Button (single export),
   Select is the lib's first "compound component" — every Radix part
   that needs Damo styling is wrapped and re-exported. The Damo
   wrapper does **not** rebuild Radix's API; it preserves
   pass-through props and adds className.

2. **Portal lives in `SelectContent`**, not at the consumer call
   site. Consumers don't need to remember to wrap with `Portal`.

3. **z-index = `--z-dropdown` (300).** This puts Select above
   sticky headers (`--z-header: 200`) but below modals
   (`--z-modal: 500`) and tooltips (`--z-tooltip: 700`). If a
   consumer renders Select inside a Dialog, the Dialog overlay is at
   400 and Select content is at 300 — but Radix portals to body, so
   stacking context isolation is generally fine. If you see a Select
   appearing behind a modal, check that the modal is using the
   lib's `--z-modal` token.

4. **Position default is `'popper'`.** Item-aligned mode (centering
   the popover on the selected item) is available but not the
   default — flip via `<SelectContent position="item-aligned">`.

5. **No focus-shadow on disabled.** Disabled buttons drop opacity
   and disable pointer-events; the focus shadow doesn't trigger.

6. **The trigger does not include the lib's `data-[state=open]`
   press affordance.** Select trigger is not a Button and intentionally
   doesn't translate on open — the focus shadow + chevron rotation is
   enough affordance for a form field.

## How to consume (shadcn-style copy)

1. Copy `select.tsx` and `index.ts`.
2. Add `@radix-ui/react-select` as a runtime dep.
3. Replace the icon imports (`ChevronDownIcon`, `ChevronUpIcon`,
   `CheckIcon`) with the consumer's icon equivalents.
4. Tokens: standard set + `--popover` / `--popover-foreground`,
   `--z-dropdown`, `--border` (for separator).

## Open questions

1. The 9 exports follow Radix's surface tightly. Worth considering a
   higher-level `<SelectField label="…" options={…} />` wrapper for
   the common case, while keeping the compound API as the escape hatch.
2. The disabled item style (`opacity-50`) is hard to read on dense
   lists — consumers sometimes need a stronger visual cue. Could be
   a `data-[disabled]:line-through` opt-in.
3. No "loading" state for async option fetching. Today consumers fake
   it with a single `<SelectItem disabled>Loading…</SelectItem>`.
