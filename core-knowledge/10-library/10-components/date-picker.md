# DatePicker

Status: documented · Last scan: 27c8471 · Sources:
`packages/ui/src/components/date-picker/{date-picker.tsx,index.ts}`.

## Summary

Single-date picker built by composing `react-day-picker` (the
`DayPicker` calendar) inside Damo's `Popover`. Trigger is a
Memphis-styled button mirroring Select/Combobox; opens a calendar
popover on click. Uses **`date-fns` Italian locale** by default, with
configurable display format. Auto-closes the popover on date selection.

## Public API

| Export            | Kind                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `DatePicker`      | `forwardRef<HTMLButtonElement, DatePickerProps>`                                                                                     |
| `DatePickerProps` | `Omit<DayPickerProps, 'mode'> & { value?, onValueChange?, placeholder?, formatStr?, disabled?, id?, className?, triggerClassName? }` |

| Prop               | Type                                | Default                     |
| ------------------ | ----------------------------------- | --------------------------- |
| `value`            | `Date`                              | uncontrolled if absent      |
| `onValueChange`    | `(date: Date \| undefined) => void` | —                           |
| `placeholder`      | `ReactNode`                         | `'Seleziona una data'`      |
| `formatStr`        | `string` (date-fns format token)    | `'PPP'`                     |
| `disabled`         | `boolean`                           | —                           |
| `id`               | `string`                            | —                           |
| `className`        | `string`                            | applied to outer wrapper    |
| `triggerClassName` | `string`                            | applied to trigger button   |
| …rest              | `Omit<DayPickerProps, 'mode'>`      | passed through to DayPicker |

`mode` is locked to `'single'` (omitted from the surface). For range
or multi-date pickers, consumers compose with `react-day-picker`
directly.

## Internal architecture

```
<div className={className}>
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <button>{selected ? format(selected, formatStr, {locale: it}) : placeholder}<CalendarIcon/></button>
    </PopoverTrigger>
    <PopoverContent>
      <DayPicker mode="single" selected={selected} onSelect={handleSelect}
                 locale={it} showOutsideDays
                 components={{ Chevron: …(ChevronLeftIcon|ChevronRightIcon) }}
                 {...dayPickerProps} />
    </PopoverContent>
  </Popover>
</div>
```

### Controlled / uncontrolled merge

Same pattern as Combobox:

```ts
const [internal, setInternal] = useState<Date | undefined>(value)
const selected = value ?? internal

function handleSelect(next) {
  if (value === undefined) setInternal(next)
  onValueChange?.(next)
  if (next) setOpen(false)
}
```

The popover closes only when a date is **chosen** (truthy `next`). A
`undefined` selection (deselect) keeps the popover open — DayPicker
allows clicking the same date to deselect, but the lib's UX treats
that as a non-event for popover dismissal.

### Trigger

Identical to Combobox/Select trigger styling — Memphis idiom + tinted
focus shadow. Adds a `CalendarIcon` (16px, `text-muted-foreground`,
`shrink-0`) on the right.

```
inline-flex h-10 w-full items-center justify-between gap-2
px-3 py-2 text-base text-foreground text-left
bg-card border-2 border-memphis rounded-none
transition-colors duration-fast cursor-pointer
hover:bg-muted
focus-visible:outline-none focus-visible:border-primary
  focus-visible:[--memphis-shadow-color:var(--primary)]
  focus-visible:shadow-memphis
disabled:opacity-50 disabled:pointer-events-none
{!selected && 'text-muted-foreground'}
```

### Calendar

`DayPicker` is rendered inside `<PopoverContent className="w-auto p-2"
align="start">` — popover sized to the calendar's natural width.

Three lib-specific tweaks:

- `mode="single"` — locked.
- `locale={i18n.datePicker.dateFnsLocale}` — month/weekday names.
  EN trees use date-fns `enUS`; IT trees use date-fns `it`. The
  locale is read from the active dictionary so it switches with
  `<I18nProvider locale="...">`.
- `showOutsideDays` — fills the calendar grid with neighbouring
  month days, faded.
- Custom `Chevron` component → uses the lib's `ChevronLeftIcon` /
  `ChevronRightIcon` instead of DayPicker's default chevrons.

Importantly, `react-day-picker/style.css` is imported at module
top-level. This is the **only** non-lib CSS the library imports
unconditionally — see Open questions.

## Notes & gotchas

1. **Locale-aware defaults.** Both the calendar's `locale` (date-fns
   bundle) and the trigger `placeholder` resolve from
   `useI18n().datePicker.{dateFnsLocale,placeholder}`. EN trees show
   `'Pick a date'` + `enUS` formatting; IT trees show `'Seleziona una
data'` + `it` formatting. Bare trees fall back to EN. See
   [16-i18n.md](../16-i18n.md). The `formatStr` prop still wins for
   custom token strings.

2. **`react-day-picker/style.css` is force-imported.** Every consumer
   of DatePicker pulls in the DayPicker base CSS, regardless of
   tree-shaking. This is correct for visual fallback but conflicts
   with the lib's "consumer compiles its own CSS" stance for
   `tokens.css`/`theme.css`. See Open questions.

3. **`formatStr` is a date-fns token.** `'PPP'` is "long localised
   date" (e.g. "5 maggio 2026"). Consumers using a different format
   pass any date-fns token (e.g. `'dd/MM/yyyy'`). Invalid tokens
   throw at runtime.

4. **No range mode.** `mode="single"` is locked. For
   range/multi-date, use `react-day-picker` directly inside Popover.

5. **`triggerClassName` separate from `className`.** Outer wrapper
   className → `className`; trigger button className →
   `triggerClassName`. The split lets consumers style the button
   without scrolling the popover root.

6. **Auto-close on select** is one-shot — once a date is picked the
   popover closes. Re-opening requires another trigger click.

## How to consume (shadcn-style copy)

1. Copy `date-picker.tsx` and `index.ts`.
2. Add `react-day-picker` and `date-fns` as runtime deps.
3. Pull `Popover` + Radix dep along.
4. Replace icon imports.
5. Locale + placeholder default come from `useI18n()`. A copy-paste
   consumer should lift `lib/i18n/` too (or stub `useI18n` to return
   a static dict). DayPicker's `locale` prop can still override
   directly.

## Open questions

1. **`react-day-picker/style.css` import.** Inconsistent with the
   "lib doesn't ship compiled CSS" rule. Either document the
   exception or theme DayPicker via the lib's tokens (which would
   require restyling DayPicker's class names — significant work).
2. **No range mode.** A `DateRangePicker` would require a parallel
   wrapper (different `mode` and different state shape).
3. **Trigger displays the localised date.** If the consumer wants an
   ISO display (`2026-05-06`), they pass `formatStr="yyyy-MM-dd"` —
   but the locale still applies. Worth documenting that `formatStr`
   alone doesn't escape locale formatting.

(The previous "Italian default locale + placeholder" open question
was resolved by PR #69 — both now route through `useI18n()`.)
