# Label

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/label/{label.tsx,index.ts}`.

## Summary

Native `<label>` with the lib's small-uppercase typography and a
`peer-disabled` style hook. No Radix, no extra logic — just a styled
forwardRef wrapper. Intended for use above form controls; for the
"label + control + hint + error" composition see `FormField`.

## Public API

| Export       | Kind                                       |
| ------------ | ------------------------------------------ |
| `Label`      | `forwardRef<HTMLLabelElement, LabelProps>` |
| `LabelProps` | `LabelHTMLAttributes<HTMLLabelElement>`    |

No variants, no extra props. `htmlFor` is the standard native attribute
and links the label to its control.

### Always-applied classes

```
text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer
peer-disabled:cursor-not-allowed peer-disabled:opacity-50
```

The `peer-disabled` hooks rely on the consumer applying Tailwind's
`peer` class to the associated input — this is a **convention, not a
Label requirement**.

## Notes

- No `font-mono` — Label uses the regular body font; Badge is the
  uppercase mono component. Don't mix them up.
- `cursor-pointer` is intentional even outside of `htmlFor`-linked
  cases, signaling "this is interactive when associated with a
  control". Override with `className` if not desired.

## How to consume (shadcn-style copy)

Single file copy. Pair with `cn` and the `--muted-foreground` token.

## Open questions

1. The `peer-disabled` hooks are useful but require the consumer's
   input to be marked `peer` — should this contract be documented in
   FormField (which is the canonical user of Label) so consumers don't
   need to re-derive it?
