# Card

Status: documented · Last scan: c38c933 · Sources:
`packages/ui/src/components/card/{card.tsx,card.variants.ts,index.ts,card.test.tsx}`.

## Summary

Generic surface container — the lib's primary "wrap content in a
bordered box" primitive. 5 variants × 4 padding sizes via cva, plus
6 compose-able sub-parts (Header / Title / Description / Body /
Footer). The **specialized cards** (ArticleCard, FeatureCard,
UserCard) compose `<Card>` internally for their frame, shadow, and
padding (since gh-60); they layer their own slot conventions on top
and target specific layouts. `<Card>` itself remains the flexible
base for ad-hoc surfaces.

## Public API

| Export            | Kind                                              |
| ----------------- | ------------------------------------------------- |
| `Card`            | `forwardRef<HTMLDivElement, CardProps>`           |
| `CardHeader`      | layout div with bottom border                     |
| `CardTitle`       | `<h3>` display-font heading                       |
| `CardDescription` | `<p>` muted small text                            |
| `CardBody`        | layout div (`py-3`)                               |
| `CardFooter`      | layout div with top border, right-aligned actions |
| `cardVariants`    | cva instance                                      |

| Card prop   | Type                                                                  | Default     |
| ----------- | --------------------------------------------------------------------- | ----------- |
| `variant`   | `'default' \| 'elevated' \| 'featured' \| 'interactive' \| 'inverse'` | `'default'` |
| `padding`   | `'none' \| 'sm' \| 'md' \| 'lg'`                                      | `'md'`      |
| `className` | `string`                                                              | —           |
| …native     | `HTMLAttributes<HTMLDivElement>`                                      | —           |

### Variants

| Variant       | Surface                         | Border / shadow                                                        |
| ------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `default`     | `bg-card`                       | `border-2 border-memphis shadow-memphis` (6px)                         |
| `elevated`    | `bg-card`                       | `border-2 border-memphis shadow-memphis-lg` (9px)                      |
| `featured`    | `bg-card`                       | `border-2 border-memphis shadow-memphis-primary` (primary-tinted, 6px) |
| `interactive` | `bg-card`                       | standard memphis + Button-style press affordance                       |
| `inverse`     | `bg-foreground text-background` | 1px tinted border + soft `shadow-md` + `rounded-md`                    |

### Sizes

| Padding | Class |
| ------- | ----- |
| `none`  | `p-0` |
| `sm`    | `p-3` |
| `md`    | `p-5` |
| `lg`    | `p-8` |

### Sub-parts

| Sub-part          | Classes                                                           |
| ----------------- | ----------------------------------------------------------------- |
| `CardHeader`      | `flex flex-col gap-1.5 pb-3 border-b border-border`               |
| `CardTitle`       | `font-display text-xl leading-tight tracking-wide` (`<h3>`)       |
| `CardDescription` | `text-sm text-muted-foreground` (`<p>`)                           |
| `CardBody`        | `py-3`                                                            |
| `CardFooter`      | `flex items-center justify-end gap-2 pt-3 border-t border-border` |

The sub-parts assume vertical stacking inside Card with `padding="md"`
or larger. Header/Footer borders use `--border` (1px soft); main Card
uses Memphis (2px hard). The visual hierarchy: Memphis frame outside
→ soft separators inside.

## Internal architecture

### `interactive` variant — full Button press affordance

```
border-2 border-memphis shadow-memphis rounded-none
cursor-pointer select-none
transition-[transform,box-shadow] duration-snap ease-memphis
hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-hover
active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-active
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
```

Replicates the **same** press affordance as Button's primary variant
— the card visually depresses on click. Use this variant for
clickable cards (links, buttons-as-cards). Note: the variant adds
`select-none` and `cursor-pointer` but **does not change the
underlying element** — a `<Card variant="interactive">` is still a
`<div>`. Wrap the card in an `<a>` or `<button>` for actual
interactivity.

### `featured` variant — primary-tinted shadow

```
border-2 border-memphis shadow-memphis-primary rounded-none
```

Uses the per-color `@utility shadow-memphis-primary` block from
`theme.css` (`box-shadow: 6 6 0 var(--primary)`). This replaces the
previous broken recipe `[--memphis-shadow-color:var(--primary)]
shadow-memphis`, which substituted the var at the declaring element
(`:root`) instead of the consumer and therefore painted black
regardless of override (#58 / #66, fixed in PR #76). Marks the card
as the page's "hero" card. FeatureCard composes
`<Card variant="featured">`, so the recipe propagates without any
local Memphis classes there.

### `inverse` variant — anomalous

```
bg-foreground text-background
border border-[color-mix(in_oklab,var(--background)_12%,transparent)]
shadow-md rounded-md
```

The only Card variant that **drops** the Memphis idiom entirely:

- 1px border, not 2px
- Tinted-transparent border color (12% background mixed with
  transparent — subtle on the dark surface)
- `shadow-md` (soft tier)
- `rounded-md` (soft corners)

Reads as "elevated dark panel" — for callouts on light pages or
content-heavy regions on dark themes.

## Notes & gotchas

1. **`interactive` variant adds press affordance but not
   interactivity.** The card looks clickable; consumers must still
   render an `<a>`, `<button>`, or attach `onClick` themselves.

2. **`inverse` is the lib's only "anti-Memphis" variant** in any
   surface component. Don't introduce more without a deliberate
   design decision.

3. **CardHeader pre-applies `border-b border-border` and `pb-3`.**
   Combined with Card's outer `padding="md"`, the visual is "Memphis
   frame outside, soft separator below header inside". For a
   borderless header, use `<div>` or override with
   `className="border-0 pb-0"`.

4. **CardFooter is right-aligned by default.** For left-aligned or
   centered footers, override `justify-end`.

5. **No `as` prop** on Card. Always renders `<div>`. For
   semantically meaningful cards (e.g. `<article>`), wrap externally.

## How to consume (shadcn-style copy)

1. Copy `card.tsx`, `card.variants.ts`, `index.ts`.
2. No external deps.
3. Tokens / utilities: `--card`, `--card-foreground`, `--foreground`,
   `--background`, `--memphis-border-color`, `--shadow-memphis`,
   `--shadow-memphis-lg`, `--shadow-memphis-hover`,
   `--shadow-memphis-active`, `--shadow-md`, `--border`, `--ring`,
   plus the `@utility shadow-memphis-primary` block (and
   `--primary` token it reads) from `theme.css` for the `featured`
   variant. See theming chapter Architecture #4 for the per-color
   tinted-shadow utility family.

## Open questions

1. **`interactive` variant misleads** — looks clickable, isn't. Add
   an `as` prop or a friendly `onClick` warning.
2. **`inverse` variant is the only anti-Memphis surface** — possibly
   move to a separate `<DarkCard>` component to reduce cognitive
   load on the variant axis.

> ~~**Specialized cards** don't compose on top of `<Card>`~~
> **Resolved (gh-60)** — ArticleCard, FeatureCard, and UserCard now
> compose `<Card>` internally for frame + shadow + padding. Public
> APIs unchanged. Off-scale paddings (`p-6` ArticleCard, `p-4`
> UserCard) handled via `padding="none"` + className escape hatch;
> FeatureCard maps cleanly onto `padding="md"` + `variant="featured"`.
> The 4px `--shadow-memphis-card` shadow used pre-refactor was
> unified to the canonical 6px `--shadow-memphis`; the 4px token
> survives in `tokens.css` for any external consumer that needs it.
