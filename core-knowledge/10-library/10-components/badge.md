# Badge

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/badge/{badge.tsx,badge.variants.ts,index.ts,badge.test.tsx}`.

## Summary

Inline status/label `<span>` with the Memphis identity: thick black
border, small offset shadow (`shadow-memphis-sm`), uppercase mono
typography. Pure presentational primitive. No state, no interactions.

## Public API

| Export           | Kind |
|------------------|------|
| `Badge`          | `forwardRef<HTMLSpanElement, BadgeProps>` |
| `BadgeProps`     | `HTMLAttributes<HTMLSpanElement> & BadgeVariants` |
| `badgeVariants`  | `cva` instance (re-exported for ad-hoc use) |
| `BadgeVariants`  | `VariantProps<typeof badgeVariants>` |

### Variants

| Variant       | Surface                                    |
|---------------|--------------------------------------------|
| `default`     | `bg-muted text-muted-foreground` |
| `featured`    | `bg-badge-featured text-badge-featured-foreground` (the only badge-specific token pair — see theming chapter) |
| `success`     | `bg-success text-success-foreground` |
| `warning`     | `bg-warning text-warning-foreground` |
| `info`        | `bg-info text-info-foreground` |
| `destructive` | `bg-destructive text-destructive-foreground` |
| `outline`     | `bg-transparent text-foreground` |

Default: `'default'`.

### Base classes

```
inline-flex items-center gap-1 px-2 py-0.5
text-[11px] font-mono font-bold uppercase tracking-[0.08em]
rounded-none whitespace-nowrap
border-2 border-memphis shadow-memphis-sm
```

Always: hard-cornered, mono uppercase 11px, Memphis bordered with the
small shadow (`shadow-memphis-sm`, the lightest of the Memphis stack).

## Notes & gotchas

- Renders a `<span>`, not `<div>` — Badge is intended to be inline with
  flowing text.
- Memphis idiom is **mandatory across all variants** (no flat /
  borderless mode). For a "soft pill" look, use `Chip` instead.
- The `featured` variant uses the badge-specific token pair documented
  in the theming chapter — every other variant maps to standard intent
  or status pairs.
- No size variant. If a smaller Badge is needed, override via
  `className`; if it becomes a recurring need, propose a `size` axis
  rather than ad-hoc overrides.

## How to consume (shadcn-style copy)

Copy `badge.tsx`, `badge.variants.ts`, and `index.ts`. Same `cn` and
Tailwind token requirements as Button. No Radix dependency.

## Open questions

1. Should `outline` also drop the `shadow-memphis-sm` for visual
   parity with Button's `outline` (which has no shadow)? Currently
   `outline` Badge keeps the shadow.
2. No `size` variant — likely fine for a status pill, but worth
   re-evaluating once a few consumers have used it.
