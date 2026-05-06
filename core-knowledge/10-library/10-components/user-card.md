# UserCard

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/user-card/{user-card.tsx,index.ts,user-card.test.tsx}`.

## Summary

Horizontal row card with a circular avatar (or initial fallback),
name + optional meta caption, and an optional right-aligned
`trailing` slot. Used for user lists, member rows, leaderboard
entries, etc.

## Public API

| Export          | Kind |
|-----------------|------|
| `UserCard`      | `forwardRef<HTMLDivElement, UserCardProps>` |
| `UserCardProps` | see below |

| Prop      | Type        | Notes |
|-----------|-------------|-------|
| `name`    | `string`    | required — displayed as the row's primary label |
| `avatar`  | `ReactNode` | optional — replaces the default initial circle |
| `meta`    | `ReactNode` | optional — mono caption below name |
| `trailing`| `ReactNode` | optional — right-aligned slot (chip, action, etc.) |
| `className`| `string`   | merged onto wrapper |
| …native   | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | `children` omitted |

## Internal architecture

```jsx
<div className="flex items-center gap-[14px] w-full p-4
                border-2 border-memphis rounded-none bg-card"
     style={{ boxShadow: 'var(--shadow-memphis-card)' }}>
  <Avatar />               {/* either custom or initial fallback */}
  <div className="flex-1 min-w-0">
    <div data-slot="name" className="font-bold text-card-foreground text-base">{name}</div>
    {meta && <div data-slot="meta" …>{meta}</div>}
  </div>
  {trailing && <div data-slot="trailing" className="shrink-0">{trailing}</div>}
</div>
```

### Avatar / initial fallback

If `avatar` is provided:
```
<div className="shrink-0 inline-flex items-center justify-center
                w-12 h-12 rounded-full border-2 border-memphis
                bg-foreground text-background">
  {avatar}
</div>
```

If not, the wrapper takes `name`'s first character (uppercased, falls
back to `'?'` if empty/whitespace) and renders it in display font:
```
<div className="… grid place-items-center …
                font-display font-bold text-xl">
  {initial}
</div>
```

48×48 circle, Memphis-bordered, `bg-foreground text-background`
inversion. Same scheme as Avatar's default fallback — but
**handrolled here**, not using the lib's Avatar component. See Open
questions.

### Layout details

- `gap-[14px]` — arbitrary spacing (14px), not a token. The lib's
  spacing scale jumps from 12 (gap-3) to 16 (gap-4), and 14 is the
  visual sweet spot for this row.
- `min-w-0` on the middle column — same flex-shrink trick used in
  Sidebar's body. Without it, long names break the layout.
- `shrink-0` on avatar and trailing — hold their natural width
  while the middle column shrinks/truncates.

### Memphis card shadow

Inline `boxShadow: 'var(--shadow-memphis-card)'` — same 4px tier
as ArticleCard / FeatureCard / Hint.

## Notes & gotchas

1. **Initial fallback** uses `name.trim().charAt(0).toUpperCase() ||
   '?'`. Multi-character emoji or extended grapheme clusters (e.g.
   `🇮🇹`, `👨‍👩‍👧`) produce a single (often unexpected) character via
   `charAt`. Use a custom `avatar` prop for non-Latin or emoji
   names if precision matters.

2. **`name` is `string`, not `ReactNode`** — limits styling.
   Inconsistent with `meta` and `trailing` which accept ReactNode.

3. **The avatar slot doesn't use the lib's `Avatar` component.**
   Hand-rolled circle. Worth folding in (especially for `AvatarImage`
   from-URL fallback). See Open questions.

4. **Source comment mentions "first letter of `name` in a plum-900
   circle"** — describes a brand consumer's palette, not lib defaults.
   The lib renders `bg-foreground` (neutral). Plum is a consumer
   palette token.

5. **`gap-[14px]`** is non-tokenized spacing — flagged because the
   lib elsewhere stays on the spacing scale.

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--card`, `--card-foreground`,
`--memphis-border-color`, `--shadow-memphis-card`, `--foreground`,
`--background`, `--muted-foreground`, `--font-display`.

## Open questions

1. **Hand-rolled avatar duplicates the lib's Avatar.** Refactor to
   reuse `<Avatar><AvatarFallback>{initial}</AvatarFallback></Avatar>`
   so URL-based fallbacks and group-stacking work out of the box.
2. **`name: string` should probably be `ReactNode`** for parity with
   meta / trailing.
3. **`gap-[14px]`** off the spacing scale — round to `gap-3` (12px)
   or `gap-4` (16px) or tokenize.
4. **Non-Latin / emoji-only names** truncate poorly via `charAt`.
   Use `Array.from(name)[0]` or grapheme-aware logic.
5. **Source comment references "plum-900"** — consumer-palette
   leakage in a doc comment.
