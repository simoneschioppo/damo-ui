# Separator

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/separator/{separator.tsx,separator.variants.ts,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-separator` with three visual styles
including a Memphis-flavored "double rule" variant. Inherits Radix's
a11y semantics (`decorative` defaults to `true` → `role="none"`; set
`decorative={false}` for a semantic separator with `role="separator"`).

## Public API

| Export             | Kind |
|--------------------|------|
| `Separator`        | `forwardRef<HTMLDivElement, SeparatorProps>` |
| `SeparatorProps`   | `Omit<ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'> & SeparatorVariants` |
| `separatorVariants`| `cva` instance |
| `SeparatorVariants`| `VariantProps<typeof separatorVariants>` |

| Prop          | Type                                  | Default        |
|---------------|---------------------------------------|----------------|
| `orientation` | `'horizontal' \| 'vertical'`          | `'horizontal'` |
| `variant`     | `'solid' \| 'dashed' \| 'memphis-double'` | `'solid'`  |
| `decorative`  | `boolean` (Radix passthrough)         | `true`         |
| `className`   | `string`                              | —              |

### Variants

| Variant          | Style |
|------------------|-------|
| `solid`          | `bg-border`, `h-px` (or `w-px` vertical) |
| `dashed`         | Transparent bg, dashed `border-border-strong`, flips border-edge per orientation |
| `memphis-double` | Two parallel `border-memphis` rules with 4px gap (`h-1` horizontal, `w-1` vertical), flips border-edges per orientation |

The `dashed` and `memphis-double` variants use `data-[orientation=…]`
selectors to flip the border edge — Radix sets the `data-orientation`
attribute on the root.

## Notes

- The `orientation` prop is intentionally re-typed (excluded from the
  Radix base, re-added by the `cva`) so `cva` can drive it directly.
- `decorative={true}` is the lib default — a separator is usually
  visual chrome, not semantic structure. Flip it to `false` for things
  like menu group dividers where the role matters for screen readers.
- Use `memphis-double` for visually heavy partitions (page sections,
  AppShell rails). Use `solid` everywhere else.

## How to consume (shadcn-style copy)

Copy `separator.tsx`, `separator.variants.ts`, `index.ts`. Add
`@radix-ui/react-separator` as a runtime dep. Tokens: `--border` and
`--border-strong`, plus the Memphis border for `memphis-double`.

## Open questions

1. The `memphis-double` variant uses a fixed 4px gap (`h-1`/`w-1`).
   Should the gap be tokenized so density / scaling work cleanly?
2. No `dotted` variant — likely intentional, but worth noting if a
   consumer requests it.
