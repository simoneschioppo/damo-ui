# Dialog

Status: documented · Last scan: 43a7a02 · Sources:
`packages/ui/src/components/dialog/{dialog.tsx,index.ts,dialog.test.tsx}`.

> **Note.** A separate `alert-dialog/` component existed historically
> (visible in stale coverage HTML) and has been **consolidated into
> Dialog** via the `severity="alert"` prop. There is no separate
> AlertDialog chapter — see Severity below.

## Summary

Modal dialog built on `@radix-ui/react-dialog` with Memphis framing
(thick black border, `shadow-memphis-lg` 9px offset). Composes 8
exports following Radix's surface, plus two semantic axes: `severity`
(default | alert) and `tone` (default | danger). The alert severity
disables overlay-click and Esc-to-close, forcing the user to choose
an explicit footer action.

## Public API

| Export                  | Pass-through to                          |
|-------------------------|------------------------------------------|
| `Dialog`                | `DialogPrimitive.Root`                   |
| `DialogTrigger`         | `DialogPrimitive.Trigger`                |
| `DialogPortal`          | `DialogPrimitive.Portal`                 |
| `DialogClose`           | `DialogPrimitive.Close`                  |
| `DialogOverlay`         | styled — full-screen backdrop            |
| `DialogContent`         | styled — centered modal panel            |
| `DialogHeader`          | layout div — `flex flex-col gap-1 pr-8`  |
| `DialogFooter`          | layout div — responsive flex (column on mobile, row on desktop) |
| `DialogTitle`           | styled — display font, large             |
| `DialogDescription`     | styled — small muted text                |

### `DialogContentProps`

Extends Radix's Content props with two additional axes:

| Prop        | Type                       | Default     | Notes |
|-------------|----------------------------|-------------|-------|
| `severity`  | `'default' \| 'alert'`     | `'default'` | `'alert'` switches `role` to `alertdialog`, blocks pointer-down-outside and interact-outside, and hides the X button |
| `tone`      | `'default' \| 'danger'`    | `'default'` | `'danger'` recolors the Memphis offset shadow to `--destructive` |
| `hideClose` | `boolean`                  | —           | Hide the X button regardless of severity |

## Internal architecture

### Severity = 'alert'

```ts
const isAlert = severity === 'alert'
const alertRoleProp = isAlert ? { role: 'alertdialog' as const } : null
```

`{role: 'alertdialog'}` is spread conditionally — passing `role={undefined}`
would wipe Radix's default `role="dialog"` (React removes attributes
whose value is `undefined`). Conditional spread preserves Radix's
default in the non-alert case.

Both `onPointerDownOutside` and `onInteractOutside` are wrapped: in
alert mode they call the consumer's handler first, then
`event.preventDefault()` if not already prevented. This blocks
overlay-click dismissal. **Esc-to-close** is also blocked because Radix
fires `onInteractOutside` for the Esc key path.

The X button is also hidden in alert mode (`!hideClose && !isAlert`)
— the user must use a footer button.

### Tone = 'danger'

A single class:
```
[--memphis-shadow-color:var(--destructive)]
```

This recolors the Memphis offset shadow to destructive red. Same
"tinted Memphis shadow" recipe used by Button's `ghost` variant and
Input's invalid state. Tone is **orthogonal** to severity — an
alert dialog can be danger-toned (irreversible delete) or
default-toned (confirmation), and a default-severity dialog can be
danger-toned (error report).

> **Recipe caveat (open issue #58).** The per-instance
> `[--memphis-shadow-color:var(--X)]` override sets the CSS custom
> property on the consuming element, but `var()` references inside
> `--shadow-memphis-lg` (declared in `tokens.css` as `<x y z var(--memphis-shadow-color)>`)
> are substituted **at the declaring element**, not the consuming
> one. Browsers therefore resolve the inner `var(--memphis-shadow-color)`
> against `:root`, ignoring the local override. Visually the danger
> tone falls back to the default Memphis shadow color. Closing the
> gap requires per-color `@utility` blocks or inline shadow
> construction, tracked in #58 and #66 (parked — Tailwind v4 strips
> custom rules outside known namespaces).

### Content positioning

```
fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2
w-full max-w-lg bg-card text-foreground
border-2 border-memphis shadow-memphis-lg rounded-none
p-6 flex flex-col gap-4
focus:outline-none
```

z-index = `--z-modal` (500). Width capped at `max-w-lg` (32rem); for
custom widths consumers override via `className`.

### Animation classes

```
data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
```

These come from `tailwindcss-animate` (see Open questions).

### Header / Footer

- Header: `flex flex-col gap-1 pr-8` — the right padding (32px) reserves
  space for the X button so the title doesn't run under it.
- Footer: `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end` —
  reverse-column on mobile (so the primary action ends up at the
  bottom of the stack, where users hit it first), right-aligned row on
  ≥640px.

### X button

When rendered, fixed at `absolute right-3 top-3`, 32×32, no border,
hover muted. Hidden when:
- `hideClose === true` (consumer override), or
- `severity === 'alert'` (alert mode requires explicit footer action).

`aria-label="Chiudi"` (Italian) — see Open questions.

## Notes & gotchas

1. **Severity vs tone are independent.** Don't conflate them.
   - severity drives **interaction** (blocks dismissal in alert)
   - tone drives **visual urgency** (recolors shadow)

2. **Overlay backdrop uses `bg-foreground/40`.** Earlier versions
   referenced `bg-ink/40`, but `--ink` was never defined in
   `tokens.css`, so the dim layer rendered transparent. Fixed in
   commit 4e6b0da by switching to the existing semantic foreground
   token.

3. **Portal lives in `DialogContent`** — consumers don't need to wrap
   with `<DialogPortal>` themselves. The portal is automatic.

4. **`DialogTitle` is required for a11y by Radix.** Omitting it
   triggers a Radix warning about missing accessible name. If the
   visual design hides the title, render it visually-hidden (e.g.
   `<DialogTitle className="sr-only">…</DialogTitle>`).

5. **`DialogDescription` is optional but recommended.** Without it,
   screen readers read only the title.

6. **Cancel-first DOM order in alert mode** is a documented convention
   (per the source comment): "Place Cancel first in the footer DOM
   order so it gets default focus." Radix doesn't enforce this — it's
   a consumer responsibility.

## How to consume (shadcn-style copy)

1. Copy `dialog.tsx` and `index.ts`.
2. Add `@radix-ui/react-dialog` and `tailwindcss-animate` (see Open
   questions about its missing peer declaration).
3. Replace the `CloseIcon` import.
4. Tokens needed: `--card`, `--foreground`, `--muted`, `--ring`,
   `--memphis-border-color`, `--shadow-memphis-lg`, `--destructive`
   (for danger tone), `--z-overlay`, `--z-modal`.
5. Translate `aria-label="Chiudi"` if not Italian.

## Open questions

1. **`tailwindcss-animate` missing from package deps.** All Radix
   wrappers use `animate-in`, `fade-in-0`, `zoom-in-95`, etc., which
   come from this plugin. The lib's `package.json` declares neither a
   runtime dep nor a peerDependency. Confirmed by user as known —
   plugin to be added to peerDependencies and documented as required
   consumer setup, particularly relevant for shadcn-style migration
   where each component's deps must be explicit.
2. **`aria-label="Chiudi"`** — Italian default. See cross-cutting i18n
   note (also Spinner, Combobox, DatePicker). Tracked as story #59.
3. **AlertDialog consolidated into Dialog.** Source dir
   `alert-dialog/` no longer exists; `severity="alert"` covers the
   case. Consumers migrating from a previous shadcn-style AlertDialog
   need to swap import + add the prop. Migration guide candidate.
4. **No `size` axis** for DialogContent. `max-w-lg` is the only
   width; consumers override via `className`. Could expose
   `size: 'sm' | 'md' | 'lg' | 'xl' | 'full'`.
