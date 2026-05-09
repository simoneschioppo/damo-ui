# Chip

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/chip/{chip.tsx,chip.variants.ts,index.ts,chip.test.tsx}`.

## Summary

Pill-shaped soft-tinted label with optional color dot and an `active`
state. Unlike Badge (Memphis-loud, mono uppercase, hard corners), Chip
is the **soft, friendly** counterpart: pill radius, mixed colors via
`color-mix`, tinted instead of saturated. Used for filters,
categories, multi-select facets.

## Public API

| Export         | Kind                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `Chip`         | `forwardRef<HTMLSpanElement, ChipProps>`                                                   |
| `ChipProps`    | `HTMLAttributes<HTMLSpanElement> & ChipVariants & { dotColor?: string; active?: boolean }` |
| `chipVariants` | `cva` instance                                                                             |
| `ChipVariants` | `VariantProps<typeof chipVariants>`                                                        |

| Prop       | Type                                                                     | Default     |
| ---------- | ------------------------------------------------------------------------ | ----------- |
| `variant`  | `'default' \| 'accent' \| 'brand' \| 'success' \| 'danger' \| 'warning'` | `'default'` |
| `size`     | `'sm' \| 'md' \| 'lg'`                                                   | `'md'`      |
| `dotColor` | `string` (any CSS color)                                                 | —           |
| `active`   | `boolean`                                                                | `false`     |

### Variants — soft tint via `color-mix`

Every non-default variant uses Tailwind arbitrary values calling
`color-mix(in oklab, var(--<token>) <pct>%, var(--card or --foreground))`:

- Background: 28% of the intent token mixed with `--card` → soft surface.
- Text: 55–65% of the intent token mixed with `--foreground` → readable
  but tinted.
- Border: 50% of the intent token mixed with transparent.

This is fundamentally different from Badge: Badge uses **saturated**
intent tokens; Chip uses **mixed** ones. The result is "tag in a
filter chip rail" instead of "status pill".

| Variant   | Token mixed with `--card`/`--foreground`              |
| --------- | ----------------------------------------------------- |
| `default` | none — solid `bg-[var(--card)]` with `border-memphis` |
| `accent`  | `--primary`                                           |
| `brand`   | `--secondary`                                         |
| `success` | `--success`                                           |
| `danger`  | `--destructive` (named `danger`, not `destructive`)   |
| `warning` | `--warning`                                           |

### Sizes

| Size | Padding / text            |
| ---- | ------------------------- |
| `sm` | `px-2 py-0.5 text-[10px]` |
| `md` | `px-3 py-1.5 text-xs`     |
| `lg` | `px-3.5 py-2 text-sm`     |

### Base classes

```
inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
rounded-pill border-2 whitespace-nowrap
```

`rounded-pill` (vs Badge's `rounded-none`) is the visual signature.

### `active` state

When `active === true`, the wrapper additionally applies
`bg-primary text-primary-foreground border-memphis`, overriding the
soft tint and switching to a solid primary fill. Used as the "selected"
state in filter chip rails.

### Color dot

When `dotColor` is set, a leading `<span>` (8×8, 1.5px border, round)
is rendered before children. The dot's border color is:

- `var(--memphis-border-color)` (black) by default
- `white` when `active` is true (so the dot stays visible against the
  primary fill)

The dot's `style` is computed inline (CSS variables not used here) —
intentional, because `dotColor` is consumer-supplied at runtime and is
not a token.

## Notes & gotchas

1. **Variant naming inconsistency.** The `cva` config uses `danger`
   (not `destructive`) and `accent`/`brand` (not `primary`/`secondary`).
   This diverges from Button's variant naming. Documented as Open
   question — a future audit may rename.

2. **`color-mix` in oklab** requires modern browsers (Safari 16.4+,
   Chrome 111+, Firefox 113+). Older browsers fall back to invalid
   value → no background, no border. Acceptable in 2026, but worth
   keeping in mind for support matrices.

3. **The `active` override is class concatenation, not a `cva`
   compound variant.** This means `cn` precedence applies:
   `bg-primary` from `active` overrides the variant's tinted
   background because it appears later in the concatenation.

4. **The dot is purely decorative** (`aria-hidden="true"`,
   `data-chip-dot=""` for stylability) — it carries no semantics.

## How to consume (shadcn-style copy)

Copy `chip.tsx`, `chip.variants.ts`, `index.ts`. Same Tailwind tokens
as Button + `--card` (in addition to the standard set). Browser support
note: requires `color-mix` for the tinted variants.

## Open questions

1. **Variant naming alignment with Button.** Should `danger` →
   `destructive`, `accent` → `primary`, `brand` → `secondary`?
   Consistent naming across components is a stronger DX win than
   "Chip uses softer-sounding names".
2. The `active` override is a hard branch — a third state ("hover but
   not active") would be useful. Currently implicit via inherited
   browser hover.
3. Should `dotColor` accept a token reference (`'primary'`,
   `'success'`) in addition to raw CSS strings, to avoid consumers
   typing `'var(--primary)'`?
