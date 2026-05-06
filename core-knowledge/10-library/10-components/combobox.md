# Combobox

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/combobox/{combobox.tsx,index.ts}`.

## Summary

Searchable single-select built by composing `cmdk` (the command-menu
library) inside Damo's `Popover`. The trigger is a Memphis-styled
button matching Select's trigger. The popover hosts a search input, an
"empty" state, and a virtualised-friendly options list with check
indicators on the selected item.

## Public API

| Export             | Kind |
|--------------------|------|
| `Combobox`         | function component (not `forwardRef` — see Notes) |
| `ComboboxOption`   | `{ value: string; label: string; disabled?: boolean }` |
| `ComboboxProps`    | see below |

| Prop                | Type                                  | Default              |
|---------------------|---------------------------------------|----------------------|
| `options`           | `ComboboxOption[]`                    | (required)           |
| `value`             | `string`                              | uncontrolled if absent |
| `defaultValue`      | `string`                              | —                    |
| `onValueChange`     | `(value: string) => void`             | —                    |
| `placeholder`       | `ReactNode`                           | `'Scegli…'`          |
| `searchPlaceholder` | `string`                              | `'Cerca…'`           |
| `emptyMessage`      | `ReactNode`                           | `'Nessun risultato'` |
| `disabled`          | `boolean`                             | —                    |
| `id`                | `string`                              | —                    |
| `className`         | `string`                              | —                    |

The component supports both **controlled** (`value` provided) and
**uncontrolled** (`defaultValue` provided) modes. In uncontrolled
mode the wrapper holds local state via `useState`.

## Internal architecture

Composition tree:

```
Popover (Damo wrapper around Radix Popover)
├── PopoverTrigger asChild
│   └── <button> (Memphis trigger, mirrors Select trigger styling)
└── PopoverContent (width = trigger width, padding 0)
    └── CommandPrimitive (cmdk root)
        ├── header row: SearchIcon + CommandPrimitive.Input
        └── CommandPrimitive.List (max-h-60, scroll-y, p-1)
            ├── CommandPrimitive.Empty (when no matches)
            └── CommandPrimitive.Item × options.length
```

### Controlled / uncontrolled merge

```ts
const [internal, setInternal] = useState<string | undefined>(defaultValue)
const selected = value ?? internal     // controlled wins

function handleSelect(next) {
  if (value === undefined) setInternal(next)   // only mutate internal in uncontrolled
  onValueChange?.(next)
  setOpen(false)
}
```

This is the same pattern Damo's other "controlled-or-uncontrolled"
wrappers use (DatePicker — see chapter). The invariant: never write to
`internal` when the parent is controlling — keeps state single-source.

### Search and filtering

`cmdk` does the filtering automatically against the `value` of each
`CommandPrimitive.Item`. The wrapper passes `value={o.value}` (not
`o.label`) — meaning the search match is against the **option value**,
not the visible label. This is a load-bearing choice (see Open
questions).

### Trigger styling

Identical to Select trigger — same Memphis idiom, same focus shadow
recipe (primary-tinted Memphis shadow). When no option is selected,
`text-muted-foreground` mutes the placeholder text.

### Item styling

```
relative flex cursor-pointer select-none items-center
py-1.5 pl-8 pr-2 text-sm outline-none rounded-sm
data-[selected=true]:bg-muted        ← cmdk's keyboard highlight
data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50
```

Note: cmdk uses `data-[selected=true]` for **keyboard focus / hover**,
not for the chosen value. The check icon (rendered when `selected ===
o.value`) marks the chosen value. Don't confuse cmdk's `selected` with
"the user's selection".

## Notes & gotchas

1. **Italian default strings.** `placeholder`, `searchPlaceholder`,
   `emptyMessage` default to Italian (`'Scegli…'`, `'Cerca…'`, `'Nessun
   risultato'`). Same i18n leakage flagged for Spinner. See Open
   questions.

2. **Not `forwardRef`.** Combobox is a `function` component — no ref
   forwarding to the trigger button. If a consumer needs the trigger
   ref, they cannot get it through Combobox today.

3. **Search matches `value`, not `label`.** A user typing "blu" finds
   options where the *value* is "blu", not where the label is
   "Blue". For typical UX this should match the *label*. Either swap
   `value={o.value}` to `value={o.label}` (and adjust `onSelect`), or
   pass cmdk a custom `filter` function. Worth confirming intent —
   see Open questions.

4. **Width = trigger width.** `w-[var(--radix-popover-trigger-width)]`
   on PopoverContent. The popover always matches the trigger; doesn't
   shrink-wrap to content.

5. **Closes on select.** `setOpen(false)` is called inside
   `handleSelect`. There is no "leave open for multi-select" mode —
   Combobox is single-select only.

6. **`max-h-60` on the list** caps height; longer option sets scroll.
   Combined with cmdk's keyboard navigation, scrolling on
   arrow-down-into-overflow works automatically.

## How to consume (shadcn-style copy)

1. Copy `combobox.tsx` and `index.ts`.
2. Add `cmdk` as a runtime dep.
3. Pull Popover (and its Radix dep) along — Combobox composes Popover.
4. Replace icon imports as needed.
5. Decide on i18n: replace the Italian defaults or require the props.

## Open questions

1. **Italian defaults** for `placeholder` / `searchPlaceholder` /
   `emptyMessage`. The library otherwise prefers English — flip these,
   or adopt a documented "Italian-first" stance for a few user-facing
   defaults.
2. **Search against `value` vs `label`.** Likely a bug — confirm
   intent before fixing.
3. **No multi-select variant.** A `MultiCombobox` is a common
   request. Today consumers compose two Comboboxes or build their
   own with cmdk directly.
4. **No async option loading.** Static `options` array only. For
   server-side search the consumer needs to debounce upstream and
   recompute `options`.
5. **Trigger ref not forwarded.** Promote to `forwardRef` if
   integration with form libraries needs ref access.
