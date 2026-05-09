# FeatureCard

Status: documented · Last scan: 99227a4 · Sources:
`packages/ui/src/components/feature-card/{feature-card.tsx,index.ts,feature-card.test.tsx}`.

## Summary

Specialized highlight card — fixed `width: 280px` (now via `w-[280px]`
className, smaller than ArticleCard's 420px). Title + description +
optional bottom row with "meta" string and "icon". Memphis frame
inherited from `<Card variant="featured">`, which provides the
**primary-tinted shadow** (`--memphis-shadow-color: var(--primary)`)
out of the box — theming the primary token re-tints this card
automatically.

> **As of gh-60**, FeatureCard composes `<Card variant="featured"
padding="md" className="w-[280px]">` internally. Public API is
> unchanged. The primary-tinted shadow recipe is now provided by
> Card's `featured` variant rather than an inline style override on
> this component, but the visual is identical (modulo the +2px shadow
> bump from the gh-60 unification: 4px `--shadow-memphis-card` →
> 6px `--shadow-memphis`).

## Public API

| Export             | Kind                                           |
| ------------------ | ---------------------------------------------- |
| `FeatureCard`      | `forwardRef<HTMLDivElement, FeatureCardProps>` |
| `FeatureCardProps` | see below                                      |

| Prop        | Type                                            | Notes                                                  |
| ----------- | ----------------------------------------------- | ------------------------------------------------------ |
| `title`     | `string`                                        | required — renders as `<h4>` (display font, uppercase) |
| `desc`      | `string`                                        | required — renders as `<p>` (muted)                    |
| `meta`      | `string`                                        | optional — bottom-row mono caption (e.g. "15+10")      |
| `icon`      | `ReactNode`                                     | optional — bottom-row right-aligned icon               |
| `className` | `string`                                        | merged onto the underlying `<Card>`                    |
| …native     | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | `title` omitted                                        |

## Internal architecture

```jsx
<Card variant="featured" padding="md" className={cn('w-[280px]', className)} ref={ref} {...rest}>
  <h4
    data-slot="title"
    className="font-display uppercase text-foreground text-2xl m-0 mb-2"
    style={{ letterSpacing: '0.02em' }}
  >
    {title}
  </h4>
  <p data-slot="desc" className="text-muted-foreground text-sm m-0 mb-6 leading-snug">
    {desc}
  </p>
  {(meta || icon) && (
    <div className="flex items-center justify-between">
      {meta ? <span data-slot="meta">…</span> : <span />}
      {icon && <span data-slot="icon">…</span>}
    </div>
  )}
</Card>
```

### Primary-tinted shadow recipe (now via Card)

Card's `featured` variant emits:

```
[--memphis-shadow-color:var(--primary)]
border-2 border-memphis shadow-memphis rounded-none
```

The `[--memphis-shadow-color:var(--primary)]` arbitrary utility sets
the CSS custom property on the element; the `shadow-memphis` utility
reads it via `var(--memphis-shadow-color)` baked into
`--shadow-memphis`. Same per-instance variable override pattern used
by Button's `ghost` and Dialog's `tone="danger"` — the only difference
here is that FeatureCard has no neutral mode, the tint is permanent.

This recipe was previously inlined on FeatureCard's own `<div>`
(`style={{ '--memphis-shadow-color': 'var(--primary)', boxShadow: 'var(--shadow-memphis-card)' }}`).
Post-gh-60, Card owns it and FeatureCard inherits.

### Footer row (meta + icon)

Renders only when at least one of `meta` / `icon` is set. If only
icon, an empty `<span />` placeholder fills the left so
`justify-between` still pushes the icon right. If only meta, no
placeholder — the icon slot is just absent.

The meta uses `font-mono font-bold text-muted-foreground uppercase
text-xs` with 0.08em letterspacing — the standard "small mono caption"
typography from the lib.

### Padding chosen from Card's scale

`padding="md"` on Card resolves to `p-5` (20px) — exactly the value
FeatureCard had pre-refactor. No `padding="none"` escape hatch needed
here, unlike ArticleCard (`p-6`) and UserCard (`p-4`).

## Notes & gotchas

1. **Fixed 280px width** — narrower than ArticleCard. Suited for
   "feature grid" layouts (3–4 across on desktop).

2. **FeatureCard _is_ `<Card variant="featured">` plus a fixed width.**
   The decision was: FeatureCard exists as a named export so consumers
   don't have to remember `<Card variant="featured" className="w-[280px]">`
   plus the title/desc/meta/icon slot conventions. If you want the
   tinted shadow without the fixed width or the slot structure, use
   `<Card variant="featured">` directly.

3. **Width is a fixed `w-[280px]`, not `max-w-`.** The card is always
   280px wide, even in a wide container. Doesn't shrink on narrow
   viewports — overflow is the consumer's problem (typically wrapped
   in a flex grid).

4. **`title` is uppercase by class** (`uppercase` Tailwind utility).
   Pre-uppercased input still reads correctly; mixed-case input
   gets coerced.

5. **`mb-6` between description and footer row** is fixed.

6. **Composition tax.** Copying FeatureCard to another repo now
   requires copying `Card` and `card.variants.ts` too — see
   "How to consume" below.

## How to consume (shadcn-style copy)

FeatureCard now depends on `<Card>`, so a clean copy needs:

1. `packages/ui/src/components/card/card.tsx`
2. `packages/ui/src/components/card/card.variants.ts`
3. `packages/ui/src/components/card/index.ts`
4. `packages/ui/src/components/feature-card/feature-card.tsx`
5. `packages/ui/src/lib/cn.ts`

Tokens: `--card`, `--card-foreground`, `--memphis-border-color`,
`--shadow-memphis`, `--primary`, `--foreground`, `--muted-foreground`,
`--font-display`. No external runtime deps.

For a single-file copy, replace `<Card variant="featured" padding="md">`
with a `<div>` carrying the recipe inline:

```jsx
<div
  className={cn(
    '[--memphis-shadow-color:var(--primary)]',
    'border-2 border-memphis shadow-memphis rounded-none',
    'bg-card text-card-foreground p-5',
    'w-[280px]',
    className,
  )}
>
  …
</div>
```

## Open questions

1. **Fixed 280px width** — same opinionated-width discussion as
   ArticleCard.
2. **No neutral / non-tinted variant.** A FeatureCard "without
   primary tinting" would unify it with ArticleCard. (Now trivially
   addressable: switch the underlying `variant` from `"featured"` to
   `"default"` and expose a prop.)
3. **Meta is `string`, not `ReactNode`** — limits flexibility.
   Inconsistent with `icon`.

> ~~**Could fold into Card** as `variant="feature"`~~ **Resolved (gh-60)**
> — already composes `<Card variant="featured">`. The remaining
> divergence is just the fixed width and the slot structure.
