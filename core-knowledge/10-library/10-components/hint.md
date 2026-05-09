# Hint

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/hint/{hint.tsx,index.ts,hint.test.tsx}`.

## Summary

Memphis-styled numbered callout: a 40×40 numbered tile on the left,
title + body on the right, all inside a Memphis-bordered container
with a `color-mix`-tinted background and the `--shadow-memphis-card`
elevation. Used in onboarding flows, "step 1 / step 2" docs blocks,
and similar enumerable callouts.

> **Despite the name, this is not a form-field "hint" / helper text
> control.** The form-field hint is `<FormField description={…}>`.
> This component is a standalone card-shaped numbered callout.

## Public API

| Export      | Kind                                    |
| ----------- | --------------------------------------- |
| `Hint`      | `forwardRef<HTMLDivElement, HintProps>` |
| `HintProps` | see below                               |

| Prop        | Type                                            | Default    | Notes                                                     |
| ----------- | ----------------------------------------------- | ---------- | --------------------------------------------------------- |
| `num`       | `number`                                        | (required) | Displayed inside the leading tile                         |
| `title`     | `ReactNode`                                     | (required) | Heading (`<h4>` semantically)                             |
| `children`  | `ReactNode`                                     | (required) | Body text                                                 |
| `className` | `string`                                        | —          | Merged to outer `<div>`                                   |
| `style`     | `CSSProperties`                                 | —          | Merged with the lib's inline `background` and `boxShadow` |
| …native     | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | —          | `title` is omitted because it conflicts with the prop     |

## Internal architecture

```
<div className="flex gap-4 p-5 items-start mb-6 border-2 border-memphis rounded-none"
     style={{ background: 'color-mix(in oklab, var(--secondary) 22%, var(--card))',
              boxShadow: 'var(--shadow-memphis-card)' }}>
  <div className="shrink-0 w-10 h-10 grid place-items-center
                  border-2 border-memphis rounded-none
                  bg-secondary text-secondary-foreground
                  font-display text-lg">
    {num}
  </div>
  <div className="flex-1">
    <h4 className="font-display text-base mb-1 text-foreground">{title}</h4>
    <p  className="text-sm text-muted-foreground leading-relaxed m-0">{children}</p>
  </div>
</div>
```

### `color-mix` background

```
color-mix(in oklab, var(--secondary) 22%, var(--card))
```

Same approach as Chip — soft tint by mixing 22% of `--secondary` into
`--card`. Stays inline (not Tailwind) because Tailwind has no
ergonomic syntax for `color-mix` in arbitrary values for the
`background-color` property without using the `bg-[…]` arbitrary
form (and that form would obscure intent given the long expression).

### `--shadow-memphis-card`

The 4px-offset variant of the Memphis shadow stack — softer than
the canonical 6px `--shadow-memphis`, harder than `--shadow-memphis-sm`
(3px). Reserved by the design system for card-shaped surfaces.

### Number tile

40×40, Memphis-bordered, fills with `bg-secondary` (the only place in
the lib where the secondary color is used as a primary fill — Chip
brand variant uses it as a tint, not a fill).

## Notes & gotchas

1. **Name confusion: not a form helper.** "Hint" historically reads
   as "input helper text" in design systems. This component is a
   numbered callout block. See Open questions.

2. **`mb-6` is baked in.** The component injects vertical spacing
   below itself (`mb-6` = 24px). Consumers stacking Hints get
   automatic gaps; consumers placing Hint inside a flex/grid with
   `gap` get _extra_ space. Override via `className`.

3. **Inline styles + Tailwind mix.** Background and shadow are inline
   (because `color-mix` and the shadow token resist Tailwind
   utilities); everything else is utility classes. The `style` prop
   merges via spread — consumer `style` overrides the inline defaults.

4. **`<h4>` is not configurable.** The title always renders as `<h4>`.
   For different heading levels, consumer must wrap externally.

5. **`<p>` body is `<p>`.** Don't pass `<div>` as `children` — it
   creates invalid HTML (block inside `<p>`). For multi-paragraph or
   block content, this component is the wrong fit.

## How to consume (shadcn-style copy)

Single-file copy. Tokens needed: `--secondary` /
`--secondary-foreground`, `--card`, `--shadow-memphis-card`,
`--memphis-border-color`, `--font-display`. `color-mix` browser
support note (see Chip).

## Open questions

1. **Naming.** "Hint" overloads the form-helper meaning. Candidates:
   `NumberedCallout`, `Step`, `OrderedHighlight`, `Tip`. Renaming
   would be a breaking change for consumers but is worth before npm
   publication.
2. **Bottom margin baked in (`mb-6`).** Inconsistent with the lib's
   "no implicit spacing" convention elsewhere (e.g. Card has no
   margin). Consider removing.
3. **`<h4>` lock.** Should accept `as` prop or `headingLevel` for
   semantic flexibility.
4. **Single tinted variant.** The 22%-secondary tint is the only
   surface. A "danger" / "warning" / "success" variant set would
   parallel Banner's role; today the two components serve overlapping
   purposes.
