# Banner

Status: documented · Last scan: c38c933 · Sources:
`packages/ui/src/components/banner/{banner.tsx,banner.variants.ts,index.ts}`.

## Summary

Inline status callout with the Memphis idiom. 4 status variants
(info / success / warning / danger), each with a default icon, soft
tinted background, and a shadow tinted to the same intent. Optional
title, optional dismiss button (uncontrolled — Banner manages its own
hidden state on dismiss).

## Public API

| Export        | Kind                                      |
| ------------- | ----------------------------------------- |
| `Banner`      | `forwardRef<HTMLDivElement, BannerProps>` |
| `BannerProps` | see below                                 |

| Prop           | Type                                            | Default                                         |
| -------------- | ----------------------------------------------- | ----------------------------------------------- |
| `variant`      | `'info' \| 'success' \| 'warning' \| 'danger'`  | `'info'`                                        |
| `title`        | `ReactNode`                                     | —                                               |
| `icon`         | `ReactNode \| false`                            | per-variant default                             |
| `dismissible`  | `boolean`                                       | —                                               |
| `onDismiss`    | `() => void`                                    | —                                               |
| `dismissLabel` | `string`                                        | _resolved from `useI18n().banner.dismissLabel`_ |
| `className`    | `string`                                        | —                                               |
| …native        | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | —                                               |

### Variants

| Variant   | Background                                                 | Shadow utility               | Default icon    |
| --------- | ---------------------------------------------------------- | ---------------------------- | --------------- |
| `info`    | `bg-card`                                                  | `shadow-memphis-info`        | `<InfoIcon/>`   |
| `success` | `color-mix(in oklab, var(--success) 12%, var(--card))`     | `shadow-memphis-success`     | `<CheckIcon/>`  |
| `warning` | `color-mix(in oklab, var(--warning) 12%, var(--card))`     | `shadow-memphis-warning`     | `<BoltIcon/>`   |
| `danger`  | `color-mix(in oklab, var(--destructive) 12%, var(--card))` | `shadow-memphis-destructive` | `<TargetIcon/>` |

Each `shadow-memphis-{intent}` utility is a per-color `@utility` block
declared in `theme.css`: `box-shadow: 6 6 0 var(--<intent>)`. Same
recipe family as Toast variants, Card featured, Button ghost. The
shadow class lives **on the variant**, not on the cva base, so each
variant emits exactly one `shadow-memphis*` utility and there is no
cross-stacking with a default `shadow-memphis` (see
[Toast](./toast.md) for the same constraint).

This replaces the previous broken recipe (base `shadow-memphis` +
per-variant `[--memphis-shadow-color:var(--<intent>)]` override),
which substituted the var at the declaring element (`:root`) instead
of the consumer and rendered black regardless of override
(#58 / #66, fixed in PR #76). See theming chapter Architecture #4.

Same double-layer tinted recipe as Toast (background + shadow share
the intent hue). **Note**: `info` does **not** tint its background
(stays `bg-card`) but does tint the shadow — info banners read as
"neutral surface, info-colored frame".

## Internal architecture

### Self-managed dismiss state

```ts
const [dismissed, setDismissed] = useState(false)
if (dismissed) return null

function handleDismiss() {
  setDismissed(true)
  onDismiss?.()
}
```

Banner is **uncontrolled** — once `dismissible && user clicks X`, it
unmounts itself and calls the optional `onDismiss` callback. There is
no controlled mode; if a consumer wants to re-show after dismiss,
they remount with a `key` prop change.

### Default icon table

```ts
const DEFAULT_ICONS = {
  info: <InfoIcon size={20} />,
  success: <CheckIcon size={20} />,
  warning: <BoltIcon size={20} />,
  danger: <TargetIcon size={20} />,
}
```

Override via the `icon` prop:

- `icon={<MyIcon />}` → custom node.
- `icon={false}` → no icon at all.
- `icon` omitted or undefined → variant default.

### `role` switching by severity

```ts
role={variant === 'danger' ? 'alert' : 'status'}
```

`alert` interrupts the screen reader (asks for immediate attention);
`status` is read passively. Don't change `danger` → `status` without
considering the a11y impact.

### Layout

```
relative flex items-start gap-3 p-4
border-2 border-memphis rounded-none
```

`shadow-memphis*` is **not** in the cva base — each variant adds its
own per-color tinted utility (see Variants above).

- `items-start` — icon, title/body block, and dismiss button align
  to the top (so multi-line titles don't push the icon down).
- `mt-0.5` on the icon span — fine-tunes the icon to align with the
  cap-height of the title text.
- `flex-1 min-w-0` on the middle column — title + body, truncates if
  needed.
- Dismiss button: 32×32, `text-muted-foreground`, hover `bg-muted`,
  standard focus ring.

## Notes & gotchas

1. **Self-managed dismiss state.** No controlled mode. For
   reset-on-something semantics, use `<Banner key={...}>`.

2. **Locale-aware `dismissLabel`** — when omitted, resolves from
   `useI18n().banner.dismissLabel` (`'Dismiss'` in EN, `'Chiudi'` in
   IT). Bare trees fall back to EN. See [16-i18n.md](../16-i18n.md).

3. **`info` variant doesn't tint its background.** Other variants do.
   Intentional but worth knowing.

4. **`role="alert"` on danger** — interrupts assistive tech.
   Reserve danger variant for genuinely urgent messages.

5. **`title && 'mt-1'`** — body text is offset 4px from the title
   when both are present. Without title, body renders flush.

## How to consume (shadcn-style copy)

1. Copy `banner.tsx`, `banner.variants.ts`, `index.ts`.
2. Replace icon imports.
3. Tokens / utilities: `--card`, `--info`, `--success`, `--warning`,
   `--destructive`, `--memphis-border-color`, `--shadow-memphis`,
   `--muted`, `--foreground`, `--muted-foreground`, `--ring`, plus the
   per-color `@utility shadow-memphis-{info,success,warning,destructive}`
   blocks from `theme.css`. See theming chapter Architecture #4.

## Open questions

1. **No controlled mode.** Add `open` / `onOpenChange` for
   parent-driven dismissal patterns.
2. **`info` background asymmetry** with the other variants — either
   tint info's background or document the deliberate choice.
3. **Could share the variant recipe with Toast** — same color-mix
   percentages, same shadow tinting, same status set.

(The previous "Italian default dismissLabel" open question was
resolved by PR #69 — the lib now ships an i18n dictionary with EN as
default.)
