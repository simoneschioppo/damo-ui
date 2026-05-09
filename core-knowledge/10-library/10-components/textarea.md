# Textarea

Status: documented · Last scan: c38c933 · Sources:
`packages/ui/src/components/textarea/{textarea.tsx,index.ts}`.

## Summary

Multi-line counterpart to `Input`. Identical Memphis idiom and
focus/invalid shadow behavior; adds default `rows=4` and `resize-y`
(vertical resize allowed).

## Public API

| Export          | Kind                                                                  |
| --------------- | --------------------------------------------------------------------- |
| `Textarea`      | `forwardRef<HTMLTextAreaElement, TextareaProps>`                      |
| `TextareaProps` | `TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }` |

| Prop        | Type                                          | Default | Notes                                                                   |
| ----------- | --------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| `invalid`   | `boolean`                                     | —       | Same semantics as Input: triggers `aria-invalid` and destructive shadow |
| `rows`      | `number`                                      | `4`     | Native attribute; defaulted by the wrapper                              |
| `disabled`  | `boolean`                                     | —       | Native; muted + non-interactive                                         |
| `className` | `string`                                      | —       | Merged via `cn`                                                         |
| …native     | `TextareaHTMLAttributes<HTMLTextAreaElement>` | —       | Including `value`, `onChange`, `placeholder`, etc.                      |

### Always-applied classes

Same as Input minus the fixed height (`h-10`), plus `resize-y`:

```
w-full px-3 py-2 text-base resize-y font-body font-medium
bg-card text-foreground placeholder:text-muted-foreground
border-2 border-memphis rounded-none
transition-colors duration-fast
hover:bg-muted
focus-visible:outline-none focus-visible:border-primary
  focus-visible:shadow-memphis-primary
disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none
aria-invalid:border-destructive
  aria-invalid:shadow-memphis-destructive
```

The `shadow-memphis-{primary,destructive}` utilities are per-color
`@utility` blocks in `theme.css`. They replace the previous broken
`[--memphis-shadow-color:var(--X)] shadow-memphis` recipe (#58 / #66,
fixed in PR #76). See [Input](./input.md) for the full rationale and
theming chapter Architecture #4 for the per-color taxonomy.

## Notes

- See the Input chapter for the full focus/invalid shadow rationale —
  identical pattern.
- `resize-y` (vertical-only) is intentional. Free-form `resize` would
  let the user widen the textarea past the container; vertical-only
  preserves the column. To lock height entirely, override with
  `className="resize-none"`.
- `rows={4}` is a default applied by the wrapper, not by `cva`. A
  consumer passing `rows={2}` overrides it cleanly.

## How to consume (shadcn-style copy)

Single file. Same considerations as Input.

## Open questions

1. **RESOLVED** (PR #76 / #66): the focus/invalid shadow recipe shared
   with Input / Select / Combobox / DatePicker now uses the per-color
   `@utility shadow-memphis-{intent}` family from `theme.css`. See
   [Input](./input.md#open-questions) and theming chapter
   Architecture #4.
2. No max-height / min-height conventions — consumers handle.
