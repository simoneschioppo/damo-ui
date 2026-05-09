# FormField

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/form-field/{form-field.tsx,index.ts,form-field.test.tsx}`.

## Summary

Accessible composition wrapper that pairs a `<label>`, an optional
description, and an optional error message with a single input child.
Wires `aria-describedby` and `aria-invalid` automatically by **cloning
the child** and merging props. Designed to wrap any of the lib's
form controls (Input, Textarea, Select trigger, etc.) without
requiring them to know about FormField.

## Public API

| Export           | Kind                                         |
| ---------------- | -------------------------------------------- |
| `FormField`      | `forwardRef<HTMLDivElement, FormFieldProps>` |
| `FormFieldProps` | see below                                    |

| Prop             | Type                                               | Default                  |
| ---------------- | -------------------------------------------------- | ------------------------ |
| `label`          | `ReactNode`                                        | (required)               |
| `description`    | `ReactNode`                                        | —                        |
| `error`          | `ReactNode`                                        | —                        |
| `id`             | `string`                                           | `fld-${useId()}`         |
| `children`       | `ReactElement` (exactly one)                       | (required)               |
| `labelClassName` | `string`                                           | —                        |
| `className`      | `string`                                           | applied to outer `<div>` |
| …native          | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | —                        |

## Internal architecture

### ID strategy

```
fieldId       = props.id ?? `fld-${useId()}`
descriptionId = description ? `${fieldId}-desc` : undefined
errorId       = error       ? `${fieldId}-err` : undefined
describedBy   = [descriptionId, errorId].filter(Boolean).join(' ')
                || undefined
```

Each piece gets a deterministic id derived from `fieldId`. The
`describedBy` string is the space-separated id list — both, one, or
neither, depending on what's rendered. `aria-describedby` undefined
when nothing to describe, so the attribute is omitted from the DOM.

### Child cloning

The component requires **exactly one ReactElement child**. It clones
that child to inject:

- `id` ← `fieldId` (only if the child didn't already have an id —
  consumer's id wins)
- `aria-describedby` ← merged: existing child's value + lib's
  computed `describedBy` (space-joined, filter empty)
- `aria-invalid` ← `true` when `error` is truthy, otherwise the
  child's existing `aria-invalid`

This is the load-bearing piece: **the input child remains agnostic of
FormField.** A bare `<input>` works; the lib's `<Input invalid={…}>`
also works (FormField overrides only when `error` is set).

### Layout

```
flex flex-col gap-1                 (outer div)
└── <label htmlFor={fieldId}>       (uppercase muted, like Label component)
└── {clone(children)}                (the input slot)
└── description (optional)           text-xs text-muted-foreground
└── error (optional)                 text-xs font-semibold text-destructive
```

The label uses the exact same classes as the lib's standalone `Label`
component (`text-xs font-semibold uppercase tracking-wider
text-muted-foreground`) but **does not import it**. This is mild
duplication — see Open questions.

## Notes & gotchas

1. **Single ReactElement child enforced by type system.** Passing an
   array of children, a string, or fragments will not type-check. If
   the consumer needs multiple inputs in one field (e.g. a tel input
   with country code), wrap them in a single composite element.

2. **Consumer's `id` wins** over the auto-generated id. The
   `htmlFor={fieldId}` on the label uses the _FormField-computed_
   fieldId, but the cloned child's id stays the consumer's. **This
   means** if the consumer passes a child with its own `id`, the
   label's `htmlFor` won't match. Either don't pass id on the child,
   or pass the same id explicitly to FormField via the `id` prop.

3. **`aria-describedby` merges** rather than overrides — preserves
   any existing description on the child while adding the description
   and error ids.

4. **`aria-invalid` overrides only when error is truthy.** If `error`
   is undefined, FormField passes through whatever the child had.
   When the child is `<Input invalid={true}>` and FormField has no
   `error`, the input remains invalid — consumer's intent preserved.

5. **No required-asterisk by default.** No `required` prop. Consumers
   add a visual marker by including it in the `label` prop directly
   (e.g. `label={<>Email <span>*</span></>}`).

## How to consume (shadcn-style copy)

Single-file copy. No external deps beyond `cn` and React. Keep the
clone-and-merge logic verbatim — its precise behavior is what makes
FormField input-agnostic.

## Open questions

1. **Label class duplication.** FormField hand-rolls the same
   `text-xs font-semibold uppercase tracking-wider text-muted-foreground`
   that the standalone `Label` component applies. Worth importing
   `Label` from the lib (or extracting the classes to a constant).
2. **No required asterisk convention.** A `required?: boolean` prop
   that auto-renders a `*` in destructive color would be ergonomic.
3. **Does not support multiple controls per field.** A composite
   "two inputs in one field" needs the consumer to wrap manually.
4. **`id` collision risk** when the consumer sets the child's id but
   not FormField's id. Could be hardened by reading the child's id
   _before_ picking `fieldId`.
