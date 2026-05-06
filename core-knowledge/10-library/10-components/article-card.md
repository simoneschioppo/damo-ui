# ArticleCard

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/article-card/{article-card.tsx,index.ts,article-card.test.tsx}`.

## Summary

Specialized content card for short editorial blocks (rules, callouts,
content snippets). Fixed `max-width: 420px` (inline style), Memphis
frame with the **card-tier shadow** (`--shadow-memphis-card`, 4px
offset — softer than the canonical 6px Memphis shadow). Three slots:
optional eyebrow label, required title, body children.

> Independent from the generic `<Card>` component. See Card chapter
> Open question 1 for the consolidation discussion.

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
| `className`| `string`   | merged onto outer wrapper |
| …native   | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | `title` omitted because of prop conflict |

## Internal architecture

```jsx
<div className="p-6 border-2 border-memphis rounded-none bg-card"
     style={{ maxWidth: '420px', boxShadow: 'var(--shadow-memphis-card)' }}>
  {label && <div className="font-mono font-bold uppercase text-muted-foreground text-xs mb-2"
                  style={{ letterSpacing: '0.2em' }}>{label}</div>}
  <h4 data-slot="title" className="font-display text-foreground text-xl m-0 mb-3 leading-tight">
    {title}
  </h4>
  <div data-slot="body" className="text-muted-foreground text-sm leading-relaxed">
    {children}
  </div>
</div>
```

Three slots are tagged with `data-slot="..."` (label / title / body)
for stylable hooks — useful when consumers want to nudge a single
slot via cascading CSS rather than per-prop overrides.

### Inline styles (max-width + shadow)

- `maxWidth: '420px'` — fixed at component level, not tokenized.
  Inline because Tailwind has no `max-w-[420px]` by default and an
  arbitrary value class would scatter the constraint.
- `boxShadow: 'var(--shadow-memphis-card)'` — uses the card-tier
  Memphis shadow (4px), not the canonical 6px. Inline because the
  shadow token is read directly without going through a Tailwind
  utility.

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

5. **Mix of inline styles and Tailwind** — same convention as
   FeatureCard, UserCard, ColorPicker. The lib uses inline styles
   when a value is a token reference (`var(--shadow-memphis-card)`)
   or a non-utility-friendly value (`maxWidth: '420px'`,
   `letterSpacing: '0.2em'`).

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--card`, `--memphis-border-color`,
`--shadow-memphis-card`, `--foreground`, `--muted-foreground`,
`--font-display`. No external deps.

## Open questions

1. **420px max-width** is opinionated. Worth either tokenizing
   (e.g. `--article-card-max-width`) or making it a prop.
2. **Heading level locked to `<h4>`** — see Hint, PageHeader open
   questions. Same pattern, same fix.
3. **Could be a Card layout/variant** — see Card Open question 1.
