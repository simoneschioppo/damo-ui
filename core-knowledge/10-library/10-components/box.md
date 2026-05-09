# Box

Status: documented · Last scan: 9a573e8 · Sources:
`packages/ui/src/components/box/{box.tsx,box.variants.ts,index.ts}`.

## Summary

Polymorphic flex layout primitive. `<Box>` renders as `<div>` by
default; the `as` prop swaps the underlying element while keeping the
flex variants intact. Six variant axes — `direction`, `gap`, `align`,
`justify`, `wrap`, `inline` — that map onto Tailwind's flex utilities.
Use Box when you'd otherwise write `<div className="flex …">` four
times in a row.

## Public API

| Export        | Kind                                                          |
| ------------- | ------------------------------------------------------------- |
| `Box`         | polymorphic forwardRef component                              |
| `BoxProps<E>` | generic type — `BoxOwnProps<E> & ComponentPropsWithoutRef<E>` |
| `boxVariants` | (not re-exported from `index.ts`, see Notes #5)               |

| Prop        | Type                                                                | Default     |
| ----------- | ------------------------------------------------------------------- | ----------- |
| `as`        | `ElementType`                                                       | `'div'`     |
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'`            | `'row'`     |
| `gap`       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10 \| 12 \| 16 \| 20`      | `0`         |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | `'stretch'` |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'`   |
| `wrap`      | `'wrap' \| 'nowrap' \| 'wrap-reverse'`                              | `'nowrap'`  |
| `inline`    | `boolean`                                                           | `false`     |
| `className` | `string`                                                            | —           |

## Notes

1. **Polymorphic typing.** `Box` is typed as a generic function so that
   the `as` prop narrows `props` to the chosen element's attribute set
   (e.g. `<Box as="a" href="…">` type-checks `href`). The type cast at
   the bottom of the source forces TS to accept the
   forwardRef-with-generic shape.

2. **`gap` is a finite enum**, not arbitrary. The set `{0,1,2,3,4,5,6,
8,10,12,16,20}` matches the lib's spacing tokens. For non-listed
   values, drop to `className="gap-7"` etc.

3. **`inline: true` uses `!inline-flex`** (with `!important`). The
   bang is needed because the base class is `flex` — without
   `!important`, the conflict resolves to `flex` (lower in the
   cascade). This is the only place the lib uses `!important` in
   variants.

4. **Always `display: flex` (or `inline-flex`).** There is no "block"
   mode. Use Container or a plain `<div>` for non-flex cases.

5. **`boxVariants` not re-exported** from `index.ts`. Source has
   `BoxVariants` type but only the component is re-exported. If a
   consumer needs the cva instance, they import it deep
   (`damo-ui/components/box/box.variants` — not part of public
   exports). Worth promoting if needed.

## How to consume (shadcn-style copy)

Single-folder copy. No external deps. The polymorphic type is
self-contained.

## Open questions

1. **`boxVariants` not re-exported** — promote or keep internal?
2. **`gap` enum** is opinionated. Does the lib want to expose
   `gap-7`/`gap-9`/`gap-11` etc., or stay deliberately constrained?
