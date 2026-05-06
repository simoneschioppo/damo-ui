# AttrToggleGroup

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/attr-toggle-group/{attr-toggle-group.tsx,use-sanitized-persisted-attr.ts,index.ts,attr-toggle-group.test.tsx}`.

## Summary

Generic toggle bound to a `data-*` attribute on `<html>` and a
`localStorage` key. Used as the **base primitive for the lib's three
"global UI mode" switchers**: ThemeSwitcher, PaletteSwitcher,
DensitySwitcher. Self-healing: if a previously-persisted value is no
longer in the current `options` set, it resets to a known-good fallback
(invariant against stale localStorage values across deploys).

Two visual variants:
- `segmented` (default) — Memphis-bordered button row with active
  segment in `bg-secondary`.
- `select` — uses the design-system Select dropdown.

## Public API

| Export                  | Kind |
|-------------------------|------|
| `AttrToggleGroup`       | `forwardRef<HTMLDivElement, AttrToggleGroupProps>` |
| `AttrToggleOption`      | `{ value: string; label: string }` |
| `AttrToggleGroupVariant`| `'segmented' \| 'select'` |
| `AttrToggleGroupProps`  | see below |

| Prop          | Type                              | Default            | Notes |
|---------------|-----------------------------------|--------------------|-------|
| `options`     | `ReadonlyArray<AttrToggleOption>` | (required)         | No implicit defaults |
| `storageKey`  | `string`                          | (required)         | localStorage key |
| `attribute`   | `string`                          | (required)         | `data-*` attribute on `<html>` |
| `defaultValue`| `string`                          | `options[0].value` | Used when nothing persisted |
| `label`       | `string`                          | —                  | Optional eyebrow label |
| `variant`     | `AttrToggleGroupVariant`          | `'segmented'`      | |
| `labelId`     | `string`                          | auto via `useId`   | For `aria-labelledby` linkage |
| `className`   | `string`                          | —                  | |
| …native       | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | — | |

## Internal architecture

The component is a thin layout shell wrapping a hook + variant
switch:

```
useSanitizedPersistedAttr(options, storageKey, attribute, fallback)
  → [current, setCurrent]

<div className="inline-flex gap-2 items-center">
  {label && <span className="eyebrow">{label}</span>}
  {variant === 'segmented'
    ? <div role="group">{options.map(button…)}</div>
    : <Select …>{options.map(SelectItem…)}</Select>
  }
</div>
```

### `useSanitizedPersistedAttr`

Sister hook (`./use-sanitized-persisted-attr.ts`) that wraps the lib
hook `usePersistedAttr` (see hooks chapter) with a sanitization pass:

```ts
useEffect(() => {
  if (!validValues.has(value)) setValue(fallback)
}, [value, fallback, validValues, setValue])
```

The effect watches a memoized `Set` of valid `value`s. If
localStorage holds a value that's no longer in `options` (e.g. theme
"miami" was renamed to "neon" in a deploy), the hook overwrites
both localStorage and the `<html>` attribute back to `fallback`. This
is the **self-healing** invariant — without it, stale localStorage
would persist a `data-theme="miami"` attribute that no CSS targets,
silently breaking the theme.

`usePersistedAttr` itself (in the hooks chapter) handles three writes:
- React state
- `localStorage[storageKey]`
- `document.documentElement.setAttribute(attribute, value)`

So calling `setCurrent('dark')` writes the React state, persists to
localStorage, and applies `<html data-theme="dark">` in one call.

### Segmented variant

Plain `<button>` row inside a Memphis-bordered container. **Not**
built on `SegmentedControl` — uses raw buttons with `aria-pressed`.

```
inline-flex border-2 border-memphis rounded-none
  child <button>:
    px-3 py-1.5 text-[13px] font-semibold capitalize cursor-pointer border-0
    + active branch:
      isActive ? 'bg-secondary text-secondary-foreground'
               : 'bg-card text-card-foreground'
```

Note: this duplicates SegmentedControl's container pattern but with
secondary-fill rather than foreground-inverted active. Worth
unifying — see Open questions.

### Select variant

Wraps `<Select>` from the lib. Trigger overrides:
- `h-auto w-auto min-w-[9rem]` — shrink-fit instead of full-width
- `py-1.5 text-[13px] font-semibold` — denser typography matching the
  segmented variant

## Notes & gotchas

1. **`<html>` mutation is a side effect.** AttrToggleGroup mutates the
   document root attribute on every change. Multiple AttrToggleGroups
   targeting the same `attribute` will fight each other — use
   distinct `attribute` keys per concern (theme / palette / density).

2. **`storageKey` and `attribute` are independent.** A consumer could
   persist under `'mode'` and write to `data-color-scheme`. Pair them
   sensibly (typically same root word).

3. **Self-healing fires on first render** when localStorage holds a
   stale value. The user sees a brief flicker (stale value → fallback)
   on page load. Acceptable for theme/palette switches; worth noting
   if the attribute drives layout.

4. **`useId` for label linkage.** When `labelId` is not provided,
   `useId` generates a stable id. SSR-safe.

5. **`segmented` variant doesn't reuse SegmentedControl.** The active
   color treatment differs (`bg-secondary` vs `bg-foreground`) and
   the variant uses `aria-pressed` toggle buttons instead of Radix
   ToggleGroup. Intentional for now — see Open questions.

6. **Capitalization.** The segmented variant applies `capitalize` to
   labels, so `"compact"` becomes "Compact". Pre-capitalized labels
   pass through unchanged.

## How to consume (shadcn-style copy)

1. Copy the whole `attr-toggle-group/` folder (component +
   `use-sanitized-persisted-attr.ts`).
2. Bring `usePersistedAttr` from the hooks layer (or copy
   alongside).
3. Bring `Select` and `Label`/`SelectItem` for the select variant —
   or drop the variant if not needed.
4. The eyebrow label uses the `.eyebrow` class from `globals.css` —
   include it or replace with a Tailwind equivalent.

## Open questions

1. **Two segmented implementations.** AttrToggleGroup's segmented
   variant duplicates much of SegmentedControl's pattern with a
   different active treatment. Worth consolidating: either parametrize
   SegmentedControl's active class, or have AttrToggleGroup wrap
   SegmentedControl.
2. **First-render flicker on stale localStorage.** Could be hidden via
   `useLayoutEffect` (vs `useEffect`) at the cost of SSR safety.
3. **No "no-op" mode.** If a consumer wants the visual without the
   `<html>` mutation, there's no escape hatch. Today they'd compose
   SegmentedControl with their own state.
4. **`storageKey` is not namespaced** — two libraries using the same
   `storageKey` collide silently. Worth either documenting a "lib-prefix"
   convention or auto-prefixing.
