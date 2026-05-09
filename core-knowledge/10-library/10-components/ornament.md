# Ornament

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/ornament/{ornament.tsx,index.ts}`.

## Summary

Decorative section divider: two horizontal gradient lines flanking a
central glyph (default: a small diamond). Used as a content separator
in long-form pages or marketing layouts. `role="separator"`,
`aria-hidden="true"` — purely decorative.

## Public API

| Export          | Kind                                                        |
| --------------- | ----------------------------------------------------------- |
| `Ornament`      | `forwardRef<HTMLDivElement, OrnamentProps>`                 |
| `OrnamentProps` | `HTMLAttributes<HTMLDivElement> & { children?: ReactNode }` |

| Prop        | Type                             | Notes                              |
| ----------- | -------------------------------- | ---------------------------------- |
| `children`  | `ReactNode`                      | Replaces the default diamond glyph |
| `className` | `string`                         | Merged onto wrapper                |
| …native     | `HTMLAttributes<HTMLDivElement>` |                                    |

## Internal architecture

```jsx
<div role="separator" aria-hidden="true" className="flex items-center gap-3 text-primary">
  <span
    style={{
      flex: 1,
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
    }}
  />
  <span style={{ flexShrink: 0, display: 'grid', placeItems: 'center' }}>
    {children ?? defaultGlyph}
  </span>
  <span
    style={{
      flex: 1,
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
    }}
  />
</div>
```

### Default glyph

```jsx
<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path d="M10 2 L13 10 L10 18 L7 10 Z" />
</svg>
```

A small diamond/rhombus, 20×20, filled with `currentColor` (which
the wrapper sets to `text-primary`). Inherits the parent's color so
overriding the wrapper's text color recolors the glyph.

### Lines

Two flanking spans, each `height: 1` (1px tall) with a horizontal
gradient that fades from transparent at the page-edge end, peaks at
`--primary` near the glyph, and fades back to transparent. Inline
styles because Tailwind has no ergonomic syntax for arbitrary linear
gradients with three stops.

`flex: 1` makes both spans share equal remaining width, regardless
of the glyph size.

### A11y

- `role="separator"` — semantic separator landmark.
- `aria-hidden="true"` — but also hidden from assistive tech because
  this is decorative. Consider `role="presentation"` instead, since
  `role="separator"` and `aria-hidden` is technically a contradiction
  (the role implies a meaningful divider; aria-hidden removes it).
  See Open questions.

## Notes & gotchas

1. **Gradient-line color is hard-tied to `--primary`.** No prop to
   recolor (you'd need to wrap in a parent that resets `--primary`).

2. **Glyph color follows wrapper's `text-primary`** — change via
   `className="text-secondary"` etc.

3. **`role="separator"` + `aria-hidden="true"`** is contradictory
   semantics. See Open questions.

4. **Inline styles dominate** — gradient lines and glyph layout
   are both inline `style` objects. Tailwind would need
   `bg-[linear-gradient(...)]` arbitrary values which become
   verbose for a 3-stop gradient.

5. **No size variant.** 1px lines + 20px glyph + gap-3. For larger
   ornaments, override via className or wrap.

## How to consume (shadcn-style copy)

Single-folder copy. Tokens: `--primary` (for both gradient and
glyph). No deps.

## Open questions

1. **`role="separator"` vs `aria-hidden`** — contradictory. Either
   drop the role (decorative pure) or drop aria-hidden (semantic).
   Decorative-pure is the more honest stance for an Ornament.
2. **Gradient color hard-coded to `--primary`** — a `tone` prop
   (or `colorVar`) would let consumers vary.
3. **Inline-style gradients** — visually correct, but harder to
   override via CSS than utility classes. A `bg-gradient-…`
   Tailwind class might be cleaner if a 3-stop horizontal fade
   utility is added.
