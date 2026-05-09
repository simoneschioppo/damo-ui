# Input

Status: documented · Last scan: d63afaf · Sources:
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
  focus-visible:[--memphis-shadow-color:var(--primary)]
  focus-visible:shadow-memphis
disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none
aria-invalid:border-destructive
  aria-invalid:[--memphis-shadow-color:var(--destructive)]
  aria-invalid:shadow-memphis
```

## Notes & gotchas

1. **Memphis shadow appears only on focus or invalid.** At rest the
   input is just a hard-bordered card-colored field. The shadow is
   used as a "this is the active field" affordance, not as a
   permanent depth effect.

2. **Per-state shadow tinting.** The shadow color flips by overriding
   `--memphis-shadow-color` per-state:
   - focus → `var(--primary)`
   - aria-invalid → `var(--destructive)`

   This is the same pattern Button's `ghost` variant uses (see Button
   chapter). Reusable as the lib's "tinted Memphis shadow" recipe.

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

Single file copy. No Radix dep. Tokens: standard set + the focus
shadow recipe (handled inline via `[--memphis-shadow-color:…]`).

## Open questions

1. The "tinted Memphis shadow on focus/invalid" recipe is now used by
   Input, Textarea, Select trigger, Combobox trigger — worth promoting
   to a documented recipe in the theming chapter, or even a
   `cn`-friendly helper (`memphisFocusShadow('primary')`).
2. No size variant. Most inputs end up needing `sm` for inline forms.
   Worth considering once usage patterns surface.
