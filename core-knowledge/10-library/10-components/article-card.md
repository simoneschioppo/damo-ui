# ArticleCard

Status: documented · Last scan: 99227a4 · Sources:
`packages/ui/src/components/article-card/{article-card.tsx,index.ts,article-card.test.tsx}`.

## Summary

Specialized content card for short editorial blocks (rules, callouts,
content snippets). Fixed `max-width: 420px` (now via `max-w-[420px]`
className), Memphis frame inherited from the generic `<Card>`. Three
slots: optional eyebrow label, required title, body children.

> **As of gh-60**, ArticleCard composes `<Card variant="default"
> padding="none" className="p-6 max-w-[420px]">` internally. Public API
> is unchanged. Shadow is now the canonical 6px Memphis shadow
> (`--shadow-memphis`) — was previously the 4px card-tier shadow
> (`--shadow-memphis-card`). The 4px shadow tier survives in `tokens.css`
> for any external consumer that still wants it.

## Public API

| Export             | Kind |
|--------------------|------|
| `ArticleCard`      | `forwardRef<HTMLDivElement, ArticleCardProps>` |
| `ArticleCardProps` | see below |

| Prop      | Type        | Notes |
|-----------|-------------|-------|
| `title`   | `string`    | required — renders as `<h4>` |
| `label`   | `string`    | optional — eyebrow above title |
| `children`| `ReactNode` | body content (multi-paragraph allowed) |
| `className`| `string`   | merged onto the underlying `<Card>` |
| …native   | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | `title` omitted because of prop conflict |

## Internal architecture

```jsx
<Card
  variant="default"
  padding="none"
  className={cn('p-6 max-w-[420px]', className)}
  ref={ref}
  {...rest}
>
  {label && (
    <div data-slot="label"
         className="font-mono font-bold uppercase text-muted-foreground text-xs mb-2"
         style={{ letterSpacing: '0.2em' }}>
      {label}
    </div>
  )}
  <h4 data-slot="title"
      className="font-display text-foreground text-xl m-0 mb-3 leading-tight">
    {title}
  </h4>
  <div data-slot="body" className="text-muted-foreground text-sm leading-relaxed">
    {children}
  </div>
</Card>
```

The three inner slots are still tagged with `data-slot="..."` (label /
title / body) for stylable hooks — useful when consumers want to nudge a
single slot via cascading CSS rather than per-prop overrides.

### Off-scale padding + className overrides

- `padding="none"` is paired with `p-6` in the className. Card's padding
  scale is `0/3/5/8` (rem multiples) and ArticleCard's design uses 24px
  (`p-6`), which isn't on the scale. Rather than extending Card's API
  for one off-scale value, the refactor uses `padding="none"` (which
  renders `p-0`, immediately overridden by `p-6` via `tailwind-merge`'s
  conflict resolution in `cn()`).
- `max-w-[420px]` — fixed at component level via Tailwind's arbitrary
  value escape. Was previously an inline `style.maxWidth = '420px'`.
- `letterSpacing: '0.2em'` on the label remains inline because
  Tailwind's `tracking-*` scale doesn't include 0.2em precisely.
- `boxShadow` is no longer set inline. The shadow comes from Card's
  `default` variant (`shadow-memphis` utility, 6px tier).

### Typography stack

- **Label**: 12px uppercase mono with 0.2em letterspacing in
  `text-muted-foreground`. Inline `letterSpacing` because Tailwind's
  `tracking-*` scale doesn't include 0.2em precisely.
- **Title**: `<h4>` display font 20px, `m-0 mb-3` (kills browser
  default margin, adds 12px below).
- **Body**: 14px relaxed leading muted text.

## Notes & gotchas

1. **Fixed 420px max-width.** Cards in a grid lay out at most 420px
   wide each; in narrower containers they shrink to fit. For
   responsive grids, this width is a useful upper bound.

2. **`title` is `<h4>` always.** No level customization. For
   semantic correctness in different page contexts, wrap externally.

3. **`mb-3` between title and body** is baked in. Override via
   className.

4. **`title` prop conflict** — same omit pattern as PageHeader and
   Hint.

5. **Inline styles are minimal.** Only `letterSpacing` on the label
   remains inline (Tailwind has no precise `tracking-[0.2em]` need
   here). The Memphis frame, shadow, and surface come from Card; the
   width cap from `max-w-[420px]`.

6. **Composition tax.** Copying ArticleCard to another repo now
   requires copying `Card`, `card.variants.ts`, and `cn()` too — see
   "How to consume" below.

## How to consume (shadcn-style copy)

ArticleCard now depends on `<Card>`, so a clean copy needs:

1. `packages/ui/src/components/card/card.tsx`
2. `packages/ui/src/components/card/card.variants.ts`
3. `packages/ui/src/components/card/index.ts`
4. `packages/ui/src/components/article-card/article-card.tsx`
5. `packages/ui/src/lib/cn.ts` (clsx + tailwind-merge wrapper)

Tokens: `--card`, `--card-foreground`, `--memphis-border-color`,
`--shadow-memphis`, `--foreground`, `--muted-foreground`,
`--font-display`. No external runtime deps.

If a consumer prefers a single-file copy, inline Card's frame classes
(`border-2 border-memphis shadow-memphis rounded-none bg-card`) onto
ArticleCard's outer div and drop the Card import — visually identical.

## Open questions

1. **420px max-width** is opinionated. Worth either tokenizing
   (e.g. `--article-card-max-width`) or making it a prop.
2. **Heading level locked to `<h4>`** — see Hint, PageHeader open
   questions. Same pattern, same fix.

> ~~**Could be a Card layout/variant**~~ **Resolved (gh-60)** — now
> composes `<Card variant="default">` internally.
