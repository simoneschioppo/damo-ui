# Toast

Status: documented · Last scan: 27c8471 · Sources:
`packages/ui/src/components/toast/{toast.tsx,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-toast` with the Memphis idiom (border

- shadow) and 4 status-tinted variants (default / success / warning /
  danger). The variant tinting uses the now-familiar pattern: `color-mix`
  soft background **plus** the **tinted Memphis shadow** (`[--memphis-shadow-color:var(--<token>)]`).
  Also includes a Viewport with responsive positioning (bottom-right on
  mobile, top-right on desktop) and standard Radix swipe-to-dismiss.

## Public API

7 exports:

| Export             | Pass-through to                  | Styled?                            |
| ------------------ | -------------------------------- | ---------------------------------- |
| `ToastProvider`    | `ToastPrimitive.Provider`        | no                                 |
| `ToastViewport`    | `ToastPrimitive.Viewport`        | yes                                |
| `Toast`            | `ToastPrimitive.Root` + variants | yes                                |
| `ToastTitle`       | `ToastPrimitive.Title`           | yes                                |
| `ToastDescription` | `ToastPrimitive.Description`     | yes                                |
| `ToastAction`      | `ToastPrimitive.Action`          | yes — Memphis-styled inline button |
| `ToastClose`       | `ToastPrimitive.Close`           | yes — X icon button                |

| Toast prop  | Type                                                   | Default     |
| ----------- | ------------------------------------------------------ | ----------- |
| `variant`   | `'default' \| 'success' \| 'warning' \| 'danger'`      | `'default'` |
| `className` | `string`                                               | —           |
| …native     | `ComponentPropsWithoutRef<typeof ToastPrimitive.Root>` | —           |

## Internal architecture

### Variants — tinted background + tinted Memphis shadow

```
default: bg-card text-foreground
success: bg-[color-mix(in oklab, var(--success) 12%, var(--card))]
         text-foreground
         [--memphis-shadow-color:var(--success)]
warning: bg-[color-mix(in oklab, var(--warning) 12%, var(--card))]
         text-foreground
         [--memphis-shadow-color:var(--warning)]
danger:  bg-[color-mix(in oklab, var(--destructive) 12%, var(--card))]
         text-foreground
         [--memphis-shadow-color:var(--destructive)]
```

Two visual layers tint together:

1. **Background**: 12% of intent token mixed into `--card` — soft
   surface (lighter mix than Chip's 28%, because Toast is a denser
   surface and needs higher legibility).
2. **Memphis shadow**: per-variant override of `--memphis-shadow-color`
   — same recipe as Button's ghost variant, Input's focus shadow,
   Dialog's danger tone.

This is the lib's most elaborate tinted-Memphis-shadow application:
both inside (background) and outside (shadow color) of the card
share the intent hue.

### Base Toast classes

```
group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden
p-4 border-2 border-memphis shadow-memphis rounded-none
data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full
  sm:data-[state=open]:slide-in-from-bottom-full
data-[state=closed]:animate-out data-[state=closed]:fade-out-80
  data-[state=closed]:slide-out-to-right-full
data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0
data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
```

Swipe gestures use Radix's `--radix-toast-swipe-end-x` CSS variable
to translate the toast as it dismisses.

### Viewport — responsive positioning

```
fixed z-toast bottom-0 right-0 flex max-h-screen w-full flex-col-reverse gap-3 p-4
sm:bottom-auto sm:top-0 sm:right-0 sm:max-w-[420px] sm:flex-col
```

- **Mobile (<640px):** bottom-right, full-width, column-reverse
  (newest at the bottom near the user's thumb).
- **Desktop (≥640px):** top-right, max 420px wide, column (newest at
  the top, list grows downward).

z-index = `--z-toast` (600), below tooltips (700) and above modals
(500) and overlays (400).

The slide animation honors the responsive pivot:

- mobile: `slide-in-from-top-full` (toast appears from above,
  flowing down into the bottom-right column-reverse stack)
- desktop: `slide-in-from-bottom-full` (toast appears from below,
  pushing up into the top-right list)

This counter-intuitive direction matches the visual pivot — slides
into existence from the opposite edge of where it lives.

### ToastAction

```
inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-semibold
border-2 border-memphis bg-card cursor-pointer
hover:bg-muted
focus-visible:outline focus-visible:outline-2 outline-offset-2 outline-ring
```

Memphis-bordered inline button, smaller than Button (h-8, text-xs)
and with no Memphis shadow (only the border) — sits inside the
Toast's already-shadowed surface.

### ToastClose

X icon button (32×32) at the right edge. `aria-label` resolves from
`useI18n().toast.closeLabel` (`'Close'` EN / `'Chiudi'` IT). See
[16-i18n.md](../16-i18n.md).

## Notes & gotchas

1. **`<ToastProvider>` required at app root.** Same as Tooltip —
   forgetting it silently breaks toasts.

2. **Variant tinting uses double layer** (background + shadow color).
   Don't strip one without the other — the cohesion is the point.

3. **Counter-intuitive slide direction.** Mobile slides from top
   into bottom; desktop slides from bottom into top. Matches the
   responsive flip. Don't simplify to "always from bottom".

4. **`fade-out-80`** (instead of `fade-out-0`) is the lib's only
   use of partial-fade — toasts fade to 80% then slide out the
   right. Looks softer than a full fade.

5. **No timer prop** — Radix's `duration` controls auto-dismiss
   timing, passed through to `ToastPrimitive.Root`. Default Radix
   duration is 5 seconds.

6. **Animation requires `tailwindcss-animate`** — see Dialog chapter
   Open questions.

## How to consume (shadcn-style copy)

1. Copy `toast.tsx` and `index.ts`.
2. Add `@radix-ui/react-toast` + `tailwindcss-animate`.
3. Replace `CloseIcon` import.
4. Tokens: `--card`, `--success`/`--warning`/`--destructive`,
   `--memphis-border-color`, `--shadow-memphis`, `--muted`, `--ring`,
   `--z-toast`.

## Open questions

1. **No imperative API** for "show toast" — consumers manage the
   `<Toast>` mount/unmount state themselves. shadcn ships a
   `useToast` hook for this; the lib doesn't. Worth shipping
   before npm migration.
2. **Action button has no variant axis.** Single visual style. For
   destructive actions inside a danger toast, consumers can't
   visually emphasize the action.
3. Inherits the lib-wide `tailwindcss-animate` open question.

(The previous "Italian close label" open question was resolved by
PR #69 — `aria-label` now reads from `useI18n().toast.closeLabel`.)
