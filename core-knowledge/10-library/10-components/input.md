# Input

Status: documented · Last scan: c38c933 · Sources:
`packages/ui/src/components/input/{input.tsx,index.ts}`.

## Summary

Single-line text input with the Memphis identity (thick black border,
hard corners, no shadow at rest). Adds a **tinted Memphis shadow on
focus** (primary-tinted) and on `aria-invalid` (destructive-tinted) —
this "shadow appears only on focus/invalid" pattern is the canonical
Damo input idiom and is reused across Textarea, Select trigger, and
Combobox trigger.

## Public API

| Export       | Kind                                                            |
| ------------ | --------------------------------------------------------------- |
| `Input`      | `forwardRef<HTMLInputElement, InputProps>`                      |
| `InputProps` | `InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }` |

| Prop        | Type                                    | Default | Notes                                                                                 |
| ----------- | --------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `invalid`   | `boolean`                               | —       | When `true`, renders `aria-invalid="true"` and triggers the destructive-tinted shadow |
| `disabled`  | `boolean`                               | —       | Native; styled as muted + non-interactive                                             |
| `className` | `string`                                | —       | Merged via `cn`                                                                       |
| …native     | `InputHTMLAttributes<HTMLInputElement>` | —       | Including `type`, `value`, `onChange`, `placeholder`, etc.                            |

### Always-applied classes

```
h-10 w-full px-3 py-2 text-base font-body font-medium
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

## Notes & gotchas

1. **Memphis shadow appears only on focus or invalid.** At rest the
   input is just a hard-bordered card-colored field. The shadow is
   used as a "this is the active field" affordance, not as a
   permanent depth effect.

2. **Per-state shadow tinting via per-color `@utility` blocks.** Focus
   paints `shadow-memphis-primary` (6 6 0 var(--primary));
   `aria-invalid` paints `shadow-memphis-destructive` (6 6 0
   var(--destructive)). Each utility lives in `theme.css` and bakes
   the intent token directly into the `box-shadow` declaration. This
   replaces the previous broken recipe
   `[--memphis-shadow-color:var(--X)] shadow-memphis`, which
   substituted the var at the declaring element (`:root`) instead of
   the consumer and rendered black regardless of override
   (#58 / #66, fixed in PR #76). Same pattern Button's `ghost`,
   Toast / Banner variants, Card featured, Dialog danger use. See
   theming chapter Architecture #4.

3. **`focus-visible:outline-none`** is intentional. The Memphis shadow
   replaces the native focus ring as the focus indicator. This is the
   only place in the lib where the focus ring is _replaced_ rather
   than _added_; everywhere else uses
   `focus-visible:outline-2 outline-offset-2 outline-ring`.

4. **`invalid` prop drives `aria-invalid`.** Setting `invalid={false}`
   does **not** emit `aria-invalid="false"` — the JSX attribute is
   `invalid || undefined`, so absent when false. Avoids polluting the
   DOM with a false attribute.

5. **`type` is just a native HTML attribute.** No special handling for
   `type="password"` (no eye toggle), `type="number"` (no spinners
   styling), or `type="search"` (no clear button). Keep these as
   higher-level compositions if needed.

## How to consume (shadcn-style copy)

Single file copy. No Radix dep. Tokens: standard set + the per-color
`@utility shadow-memphis-{primary,destructive}` blocks must exist in
the consumer's `theme.css` (see theming chapter Architecture #4 for
the full taxonomy and the `cn.ts` `tailwind-merge` extension required
to make consumer `shadow-none` overrides work).

## Open questions

1. **RESOLVED** (PR #76 / #66): the focus/invalid tinted-shadow recipe
   used by Input, Textarea, Select trigger, Combobox trigger,
   DatePicker trigger now uses the per-color `@utility shadow-memphis-{intent}`
   family from `theme.css`. The previous per-instance
   `[--memphis-shadow-color:var(--X)]` recipe was broken at runtime
   (var-substitution at declaring element, not consumer). Theming
   chapter Architecture #4 is the canonical reference.
2. No size variant. Most inputs end up needing `sm` for inline forms.
   Worth considering once usage patterns surface.
