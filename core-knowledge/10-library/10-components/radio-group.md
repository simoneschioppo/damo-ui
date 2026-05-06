# RadioGroup

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/radio-group/{radio-group.tsx,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-radio-group` exposing two parts:
`RadioGroup` (the root, vertical flex by default) and `RadioGroupItem`
(individual circular radio with Memphis border). Selection indicator is
a small filled disc inside the item.

## Public API

| Export            | Kind |
|-------------------|------|
| `RadioGroup`      | `forwardRef<…, RadioGroupPrimitive.Root props>` |
| `RadioGroupItem`  | `forwardRef<…, RadioGroupPrimitive.Item props>` |

Props are exactly Radix's. Notably:
- `RadioGroup.Root`: `value`, `defaultValue`, `onValueChange`,
  `disabled`, `name`, `required`, `orientation`, `dir`, `loop`.
- `RadioGroup.Item`: `value` (required), `disabled`, `id`, plus the
  standard Radix indicator children come automatically.

### `RadioGroup` always-applied classes

```
flex flex-col gap-2
```

Default vertical layout. For horizontal, override `className`
(e.g. `className="flex flex-row gap-4"`); Radix handles arrow-key
navigation regardless of visual orientation.

### `RadioGroupItem` always-applied classes

```
inline-flex items-center justify-center shrink-0
h-5 w-5 rounded-full border-2 border-memphis bg-card
transition-colors duration-fast cursor-pointer
hover:bg-muted
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
disabled:opacity-50 disabled:pointer-events-none
```

Indicator: `<span className="block h-2.5 w-2.5 rounded-full bg-foreground" />`
inside `RadioGroupPrimitive.Indicator` (which only renders when the
item is selected).

## Notes

- The radio is **circular** (`rounded-full`) — the only Memphis-styled
  control in the lib that isn't square. Intentional: radio circles are
  a hard a11y/UX expectation.
- **No checked surface flip** like Checkbox; selection is conveyed
  purely by the inner dot. Surface stays `bg-card`.
- Pair `RadioGroupItem` with a `Label` (set `htmlFor` to the item's
  `id`) for clickable text labels — Radix doesn't enforce this.
- Radix passes through `orientation="vertical"` by default; overriding
  to `"horizontal"` changes arrow-key behavior to left/right.

## How to consume (shadcn-style copy)

1. Copy `radio-group.tsx` and `index.ts`.
2. Add `@radix-ui/react-radio-group` as a runtime dep.

## Open questions

1. No "RadioGroupLabel" sub-component for grouped option labels (the
   small uppercase title above a set of options). Consumers compose
   with `Label` manually; could be added if the pattern becomes common.
2. The disabled-when-checked styling currently dims the whole item.
   Some designs keep the dot visible and only mute the surface —
   worth surfacing if a consumer hits this.
