# FeatureCard

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/feature-card/{feature-card.tsx,index.ts,feature-card.test.tsx}`.

## Summary

Specialized highlight card — fixed `width: 280px` (smaller than
ArticleCard's 420px). Title + description + optional bottom row with
"meta" string and "icon". Memphis frame with a **primary-tinted
shadow** (`--memphis-shadow-color: var(--primary)`) so theming the
primary token re-tints this card automatically.

## Public API

| Export             | Kind |
|--------------------|------|
| `FeatureCard`      | `forwardRef<HTMLDivElement, FeatureCardProps>` |
| `FeatureCardProps` | see below |

| Prop      | Type                 | Notes |
|-----------|----------------------|-------|
| `title`   | `string`             | required — renders as `<h4>` (display font, uppercase) |
| `desc`    | `string`             | required — renders as `<p>` (muted) |
| `meta`    | `string`             | optional — bottom-row mono caption (e.g. "15+10") |
| `icon`    | `ReactNode`          | optional — bottom-row right-aligned icon |
| `className`| `string`            | merged onto wrapper |
| …native   | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | `title` omitted |

## Internal architecture

```jsx
<div className="p-5 border-2 border-memphis rounded-none bg-card"
     style={{
       width: '280px',
       '--memphis-shadow-color': 'var(--primary)',
       boxShadow: 'var(--shadow-memphis-card)',
     }}>
  <h4 data-slot="title" className="font-display uppercase text-foreground text-2xl m-0 mb-2"
      style={{ letterSpacing: '0.02em' }}>{title}</h4>
  <p data-slot="desc" className="text-muted-foreground text-sm m-0 mb-6 leading-snug">{desc}</p>
  {(meta || icon) && (
    <div className="flex items-center justify-between">
      {meta ? <span data-slot="meta">…</span> : <span />}
      {icon && <span data-slot="icon">…</span>}
    </div>
  )}
</div>
```

### Primary-tinted shadow recipe

```ts
{ '--memphis-shadow-color': 'var(--primary)',
  boxShadow: 'var(--shadow-memphis-card)' }
```

The source comment explains:

> Memphis frame with the Memphis card shadow (`--shadow-memphis-card`)
> recoloured to `--primary` via a scoped `--memphis-shadow-color`
> override, so customising the token in the theme generator updates
> this card too.

This is the **per-instance variable override** pattern used by
Button's `ghost`, Input's focus, Dialog's `tone="danger"`, Card's
`featured` variant. Here it's permanent on every FeatureCard
instance — there's no neutral mode.

### Footer row (meta + icon)

Renders only when at least one of `meta` / `icon` is set. If only
icon, an empty `<span />` placeholder fills the left so
`justify-between` still pushes the icon right. If only meta, no
placeholder — the icon slot is just absent.

The meta uses `font-mono font-bold text-muted-foreground uppercase
text-xs` with 0.08em letterspacing — the standard "small mono caption"
typography from the lib.

## Notes & gotchas

1. **Fixed 280px width** — narrower than ArticleCard. Suited for
   "feature grid" layouts (3–4 across on desktop).

2. **Primary-tinted shadow is mandatory.** No prop to disable. Use
   `<Card variant="featured">` for the same recipe with a default
   neutral fallback.

3. **Width is inline, not max-width.** `width: '280px'` (not
   `maxWidth`) means the card is always 280px wide, even in a wide
   container. Doesn't shrink on narrow viewports — overflow is
   the consumer's problem (typically wrapped in a flex grid).

4. **`title` is uppercase by class** (`uppercase` Tailwind utility).
   Pre-uppercased input still reads correctly; mixed-case input
   gets coerced.

5. **`mb-6` between description and footer row** is fixed.

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--card`, `--memphis-border-color`,
`--shadow-memphis-card`, `--primary`, `--foreground`,
`--muted-foreground`, `--font-display`. No external deps.

## Open questions

1. **Fixed 280px width** — same opinionated-width discussion as
   ArticleCard.
2. **No neutral / non-tinted variant.** A FeatureCard "without
   primary tinting" would unify it with ArticleCard.
3. **Meta is `string`, not `ReactNode`** — limits flexibility.
   Inconsistent with `icon`.
4. **Could fold into Card** as `variant="feature"` with `width` /
   `tone` props — see Card Open question 1.
