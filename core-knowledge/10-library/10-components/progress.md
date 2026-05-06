# Progress

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/progress/{progress.tsx,index.ts}`.

## Summary

Linear progress bar built on `@radix-ui/react-progress`. 12px-tall
muted track with a 1px Memphis border and `rounded-md` corners (soft).
The fill (`bg-secondary`) animates via a `transform: translateX(-X%)`
where X = `100 - value`.

## Public API

| Export          | Kind |
|-----------------|------|
| `Progress`      | `forwardRef<…, ProgressProps>` |
| `ProgressProps` | `ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }` |

| Prop                 | Type                          | Notes |
|----------------------|-------------------------------|-------|
| `value`              | `number`                      | 0–100; null/undefined → indeterminate (Radix default) |
| `indicatorClassName` | `string`                      | className for the moving fill |
| `className`          | `string`                      | className for the track |
| …Radix               | `Progress.Root` props         | Including `max` (default 100) |

## Internal architecture

```jsx
<ProgressPrimitive.Root value={value} className={
  relative h-3 w-full overflow-hidden bg-muted
  border border-memphis rounded-md
}>
  <ProgressPrimitive.Indicator
    className="h-full w-full flex-1 bg-secondary transition-transform duration-slow ease-out"
    style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
  />
</ProgressPrimitive.Root>
```

### Translation-based fill

The indicator is **always 100% wide**, then translated leftward. At
`value=70`, `transform: translateX(-30%)` — 30% of the indicator hides
off the left edge, 70% is visible. This is Radix's recommended
pattern: animations are GPU-accelerated translates rather than
animated `width: X%`.

`value ?? 0` defaults to 0 when `value` is null/undefined; Radix's
indeterminate state isn't visualized — an indeterminate Progress
shows an empty bar. See Open questions.

### Visual divergence from the lib's defaults

- **`border` (1px)** instead of the lib's standard `border-2`.
- **`rounded-md`** instead of `rounded-none`.
- **`ease-out`** instead of `ease-memphis`.
- **`duration-slow`** (300ms) — slower than the lib's
  `duration-fast` (150ms) defaults; makes the fill feel
  reassuring rather than snappy.

These are deliberate softness choices for a feedback element that
should feel calming, not "popping".

## Notes & gotchas

1. **Indeterminate state has no visual.** Radix exposes
   `data-[state=indeterminate]`; the lib doesn't render anything
   special. Consumers needing a striped/pulsing indeterminate
   bar override.

2. **Fill color (`bg-secondary`) is not configurable via prop.**
   Override via `indicatorClassName="bg-success"` for status bars.

3. **`value > 100` overflows** — translates by a negative
   percentage of the inner width, which may render as a fully
   filled bar (or worse, depending on CSS resolution). Always
   clamp before passing.

4. **`value < 0`** — translates by more than 100%, making the
   fill disappear off the right. Same: clamp.

5. **Standard tier shadow / border** — divergence from Memphis
   for softness. Don't "fix" without re-evaluating the visual
   intent.

## How to consume (shadcn-style copy)

1. Copy `progress.tsx` and `index.ts`.
2. Add `@radix-ui/react-progress` as a runtime dep.
3. Tokens: `--muted`, `--memphis-border-color`, `--secondary`.

## Open questions

1. **No indeterminate visual.** A striped/pulsing animation would
   give "loading without known duration" feedback.
2. **No status-tinted variants** — the standard `success` /
   `warning` / `destructive` tinting pattern (used in Toast, Chip,
   etc.) would extend cleanly.
3. **Soft tier (border-1, rounded-md)** is a deliberate exception
   from the Memphis idiom. Worth documenting in conventions.
4. **No vertical variant.** Some uses (charging bars, multi-step
   progress) want vertical orientation.
