# Checkbox

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/checkbox/{checkbox.tsx,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-checkbox` styled with the Memphis idiom
(20×20 square, 2px black border, hard corners, no shadow). Renders a
custom check glyph (`CheckIcon` from the lib's icon set) inside the
Radix indicator on `data-[state=checked]`.

## Public API

| Export     | Kind                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `Checkbox` | `forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>` |

The component re-exports nothing else — the indicator is internal.
Props are exactly Radix's `Checkbox.Root` props (`checked`,
`defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`,
`value`, `id`, etc.) plus `className`.

### Always-applied classes

```
inline-flex items-center justify-center shrink-0
h-5 w-5 border-2 border-memphis rounded-none bg-card
transition-colors duration-fast cursor-pointer
hover:bg-muted
data-[state=checked]:bg-foreground data-[state=checked]:text-background
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
disabled:opacity-50 disabled:pointer-events-none
```

The indicator glyph: `<CheckIcon size={14} strokeWidth={3} />`. Stroke
width 3 is intentional (chunky check, matches the lib's heavy aesthetic).

## Notes

- **Checked surface flips to `bg-foreground` / `text-background`** —
  inverted, not tinted. This makes the checkbox read as a hard "filled"
  state regardless of theme.
- Hover affects the **unchecked** state only (`hover:bg-muted`). When
  checked, the surface is already inverted; hover would visually
  conflict.
- Standard focus ring (offset 2) — does **not** use the Input-style
  tinted Memphis shadow.
- Radix handles all the keyboard/a11y semantics:
  `role="checkbox"`, `aria-checked`, Space toggles, etc.
- For the indeterminate state, Radix supports `checked="indeterminate"`
  which Damo's wrapper doesn't render specially — falls back to the
  same indicator (which only fires on `state=checked`). Consumers
  needing indeterminate visuals will need to extend.

## How to consume (shadcn-style copy)

1. Copy `checkbox.tsx` and `index.ts`.
2. Add `@radix-ui/react-checkbox` as a runtime dep.
3. Replace the `CheckIcon` import with the consumer's icon equivalent
   (or copy the icon from `icons/check.tsx`).

## Open questions

1. **Indeterminate state has no visual.** Radix supports it; the
   wrapper does not render anything specific. Worth adding a
   `data-[state=indeterminate]` minus glyph if needed.
2. **No size variant.** 20×20 hard-coded. If multiple sizes become
   useful (e.g. compact form rows), introduce `size: 'sm' | 'md'`.
