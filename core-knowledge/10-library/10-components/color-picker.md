# ColorPicker

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/color-picker/{color-picker.tsx,index.ts,color-picker.test.tsx}`.

## Summary

Native `<input type="color">` swatch paired with a hex `<Input>`. Both
controls share the same `value` and emit `onChange` independently
(swatch on color-picker change, input on every keystroke). Validation
is **the parent's responsibility** — the component does not validate
hex strings before passing them to `onChange`.

## Public API

| Export             | Kind                                           |
| ------------------ | ---------------------------------------------- |
| `ColorPicker`      | `forwardRef<HTMLDivElement, ColorPickerProps>` |
| `ColorPickerProps` | see below                                      |

| Prop        | Type                     | Default                | Notes                                                      |
| ----------- | ------------------------ | ---------------------- | ---------------------------------------------------------- |
| `id`        | `string`                 | auto via `useId`       | Forwarded to swatch, used for `htmlFor`                    |
| `label`     | `string`                 | (required)             | Used as visible Label and as `aria-label` even when hidden |
| `value`     | `string`                 | (required, controlled) | Hex string typically; native input expects `#rrggbb`       |
| `onChange`  | `(next: string) => void` | (required)             | Called from both swatch and hex input                      |
| `showInput` | `boolean`                | `true`                 | Hide the hex input to show only the swatch                 |
| `showLabel` | `boolean`                | `true`                 | Hide the visible Label; aria-label still set               |
| `className` | `string`                 | —                      |                                                            |

## Internal architecture

Two-row composition:

```
<div ref={ref} className={…}>
  {showLabel && <Label htmlFor={colorId}>{label}</Label>}
  <div style={row layout}>
    <input type="color" style={swatchStyle} aria-label="Color picker for {label}" />
    {showInput && <Input style={hexInputStyle} aria-label="Hex value for {label}" />}
  </div>
</div>
```

### Swatch (native `<input type="color">`)

Inline `style` (not Tailwind classes — see Notes #2):

```
{ width: 44, height: 'calc(var(--spacing) * 10)',
  padding: 2, border: '2px solid var(--memphis-border-color)',
  background: 'var(--card)', cursor: 'pointer' }
```

The `height: calc(var(--spacing) * 10)` makes the swatch
**density-aware** — same trick used in Switch's thumb translate. The
swatch grows/shrinks with the lib's density token.

### Hex input

Uses the lib's `Input` component (Memphis idiom + tinted focus
shadow), with inline overrides:

```
{ minWidth: '6ch', flex: 1, fontFamily: 'var(--font-mono)' }
```

`6ch` is the natural width of `#rrggbb`. `font-family: mono` gives the
hex value a code-like appearance.

### IDs and a11y

- `id` is auto-generated via `useId()` if not provided.
- The visible Label uses `htmlFor={colorId}` to link to the swatch.
- Both inputs have an `aria-label` — even when the visible Label is
  shown, this gives precise per-control description ("Color picker
  for Accent" vs "Hex value for Accent").

## Notes & gotchas

1. **Validation is parent's responsibility.** The hex `<Input>` fires
   `onChange` on every keystroke — including invalid intermediate
   values like `'#ab'`. The parent must guard before applying to
   theme state or persisting. The native swatch only emits valid
   `#rrggbb` so it is safe.

2. **Mix of inline `style` and Tailwind elsewhere.** The swatch and
   row use inline `CSSProperties`, not Tailwind utility classes. This
   is unusual for the lib (Tailwind-first) and is the only place
   inline styles dominate. Reasoning is implicit but likely about
   precise per-pixel sizing for the native color input — see Open
   questions.

3. **No alpha channel.** Native `<input type="color">` doesn't support
   alpha; the hex input accepts whatever the user types but the
   swatch ignores `#rrggbbaa`. Consumers needing alpha need a custom
   picker.

4. **`label` is required even when `showLabel={false}`.** It is
   reused as `aria-label` — never optional.

5. **Controlled-only.** No `defaultValue`; `value` and `onChange` are
   both required.

## How to consume (shadcn-style copy)

1. Copy `color-picker.tsx` and `index.ts`.
2. Pull the lib's `Label` and `Input` components alongside.
3. Either keep `--spacing` density-awareness (lib's density system)
   or replace `calc(var(--spacing) * 10)` with a literal `40px`.

## Open questions

1. **Inline styles vs Tailwind.** Why the divergence from the
   utility-first convention? Either document it (precise sizing for
   the native control) or migrate to Tailwind for consistency.
2. **No hex validation.** A `validateOnBlur` opt-in (or a paired
   `error` prop bound to `aria-invalid`) would harden against invalid
   intermediate values.
3. **No alpha support.** A `format='rgba' | 'hex'` axis is plausible
   future work.
4. The native swatch is browser-styled — Chrome/Firefox/Safari render
   it differently. Consumers wanting visual consistency need a custom
   picker (e.g. `react-colorful`).
