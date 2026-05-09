# Button

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/button/{button.tsx,button.variants.ts,index.ts,button.test.tsx,button.stories.tsx}`.

> **Canonical primitive.** Button establishes the patterns the rest of the
> Memphis-styled primitives follow (variant authoring with `cva`, the
> Memphis idiom, `asChild` via Radix Slot, `forwardRef`, `cn` merging,
> the `data-[state=open]` press affordance). Other component chapters
> reference this file rather than restate.

## Summary

Memphis signature button: thick black border, hard offset shadow, and a
press affordance that translates the element by 3px on `:active`. Built
on top of CVA for variant composition and Radix `Slot` for the
`asChild` pattern. Pure `<button>` semantics by default; can render any
single React child (typically `<a>` or a Next `<Link>`) without losing
visual or animation classes.

## Public API

Exported from `@damo/ui` as:

| Export           | Kind                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `Button`         | `forwardRef` component                                                                       |
| `ButtonProps`    | type — extends `ButtonHTMLAttributes<HTMLButtonElement>` + `ButtonVariants` + `{ asChild? }` |
| `buttonVariants` | `cva` instance — usable to apply Button styling to non-Button elements                       |
| `ButtonVariants` | type — `VariantProps<typeof buttonVariants>`                                                 |

### Props

| Prop        | Type                                                                          | Default     | Notes                                                              |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `variant`   | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'outline' \| 'link'` | `'primary'` | See Variants                                                       |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'icon'`                                              | `'md'`      | `icon` is square 40×40                                             |
| `fullWidth` | `boolean`                                                                     | `false`     | `w-full`                                                           |
| `asChild`   | `boolean`                                                                     | `false`     | Renders the child element with Button styles via Radix `Slot`      |
| `type`      | `'button' \| 'submit' \| 'reset'`                                             | `'button'`  | Forwarded only to `<button>`, **not** to `asChild` children        |
| `className` | `string`                                                                      | —           | Merged via `cn` (i.e. `tailwind-merge` semantics)                  |
| …native     | `ButtonHTMLAttributes<HTMLButtonElement>`                                     | —           | All native button attributes pass through                          |
| `ref`       | `Ref<HTMLButtonElement>`                                                      | —           | Forwarded; with `asChild` it points to the rendered **child** node |

### Variants

| Variant       | Surface                                 | Shadow / border                                                     | Press affordance                 |
| ------------- | --------------------------------------- | ------------------------------------------------------------------- | -------------------------------- |
| `primary`     | `bg-primary`                            | `border-2 border-memphis shadow-memphis`                            | yes (active + data-[state=open]) |
| `secondary`   | `bg-secondary`                          | `border-2 border-memphis shadow-memphis`                            | yes (active + data-[state=open]) |
| `ghost`       | `bg-card`                               | `border-2 border-memphis`, shadow uses `--primary` as memphis color | yes                              |
| `destructive` | `bg-destructive`                        | `border-2 border-memphis shadow-memphis`                            | yes                              |
| `outline`     | `bg-card`                               | `border-2 border-memphis`, no shadow                                | **no press** (intentionally)     |
| `link`        | `bg-transparent text-primary underline` | no border, no shadow                                                | **no press** (intentionally)     |

### Sizes

| Size   | Padding / dimensions    | Text class  | Gap       |
| ------ | ----------------------- | ----------- | --------- |
| `sm`   | `px-3 py-1.5`           | `text-sm`   | `gap-1.5` |
| `md`   | `px-5 py-2.5`           | `text-base` | `gap-2`   |
| `lg`   | `px-7 py-3.5`           | `text-lg`   | `gap-2.5` |
| `icon` | `h-10 w-10 p-0` (40×40) | inherits    | —         |

A compound variant set forces `link` to drop padding regardless of
size, while preserving the text class for that size (`!p-0` overrides
the size's `px-* py-*`).

## Internal architecture

Two files behind a single index:

- `button.tsx` — render logic (≈45 LOC). `forwardRef`, asChild branch,
  `cn(buttonVariants(...), className)`. No state, no effects.
- `button.variants.ts` — full `cva` definition (≈90 LOC). Single source
  of truth for visual styles.

The component is a **stateless presentational primitive** — no React
state, no effects, no portals. All animation is CSS-only.

### `cva` shape

```
cva(base, {
  variants: { variant, size, fullWidth },
  compoundVariants: [ link × {sm,md,lg,icon} → !p-0 + text-* ],
  defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
})
```

Base classes (always applied):

```
inline-flex items-center justify-center whitespace-nowrap cursor-pointer
font-body font-semibold
transition-[transform,box-shadow,background-color,color] duration-snap ease-memphis
disabled:opacity-50 disabled:pointer-events-none
```

The transition list is **specific** (transform, box-shadow,
background-color, color) — not `transition-all` — to avoid animating
unrelated incidental properties.

### `asChild` flow

```
if (asChild) <Slot ref={ref} className={composedClassName} {...rest} />
else         <button ref={ref} type={type} className={composedClassName} {...rest} />
```

Radix `Slot` clones the single child and merges props. The ref points
to the child DOM node when `asChild` is true (verified by tests). The
default `type="button"` is **only** applied when rendering a real
`<button>` — not propagated to `<a>` children, since `type` on `<a>`
means MIME type and would change semantics.

### `cn` merge order

`cn(buttonVariants(...), className)` — variant classes come first,
consumer `className` last. Because `cn` is `tailwind-merge`-backed,
later wins on conflicting Tailwind utilities. So a consumer
`className="bg-blue-500"` overrides the variant's `bg-primary`. This
is the lib-wide convention for any `cn` call: **variant base first,
consumer override last.**

## Invariants & gotchas

1. **`primary | secondary | ghost | destructive` mirror their `:active`
   press on `data-[state=open]`.** This exists because Radix Popper
   triggers (`DropdownMenu`, `Popover`, `ContextMenu`, …) interrupt the
   browser's `:active` state when the surface opens (focus moves into
   the portal). Without the data-state mirror, the button would snap
   back to its rest position mid-press while the menu is open.
   `outline` and `link` deliberately have **no** press, so they don't
   need this mirror — tests assert their absence.

2. **`ghost` reuses the Memphis shadow stack with a recolored
   shadow.** `[--memphis-shadow-color:var(--primary)]` is a per-instance
   variable override; the `shadow-memphis` utility then resolves to a
   primary-tinted shadow instead of black. This is a pattern other
   "tinted-shadow" components can copy.

3. **`type` defaulting to `"button"`.** Without this default, a Button
   inside a `<form>` triggers submit on Enter. Always-explicit
   `type="button"` prevents accidental form submission. The default is
   intentionally **not** propagated to `asChild` children.

4. **Focus ring uses `outline-ring` token.** Every variant exposes
   `focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-ring` (offset 2,
   except `link` uses offset 4 because the underline sits on the text).

5. **Disabled treatment is a base class, not per-variant.**
   `disabled:opacity-50 disabled:pointer-events-none`. Adding
   per-variant disabled styles is a smell.

6. **No CSS file.** All styling is utility classes; the button has
   zero local CSS. Skeleton's shimmer animation is the only
   keyframe-defined thing in the lib (lives in `globals.css`).

7. **`.size = 'icon'` is for icon-only buttons** — pair with
   `aria-label` (tests cover this) since there is no visible text.

## How to consume (shadcn-style copy)

To lift Button into a consumer repo:

1. Copy `button.tsx`, `button.variants.ts`, and `index.ts` into
   `<consumer>/components/ui/button/`.
2. Ensure `@radix-ui/react-slot` is installed (peer of `asChild`).
3. Ensure a `cn` helper exists (canonically `clsx` + `tailwind-merge`)
   at `<consumer>/lib/cn.ts`. Update the relative import.
4. Ensure the Tailwind tokens that Button uses are defined in the
   consumer's stylesheet — see the theming chapter. Specifically:
   `bg-primary`, `text-primary-foreground`, `bg-secondary`,
   `text-secondary-foreground`, `bg-destructive`,
   `text-destructive-foreground`, `bg-card`, `text-card-foreground`,
   `bg-muted`, `bg-transparent`, `text-primary`, `border-memphis`,
   `shadow-memphis*`, `outline-ring`, `duration-snap`, `ease-memphis`.
5. If the consumer doesn't want the Memphis aesthetic, the
   variants file is the only thing to retheme — `button.tsx` itself
   has no aesthetic opinions.

Per-component runtime deps (for the future shadcn-CLI registry):

- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx` + `tailwind-merge` (transitively, via `cn`)

## Open questions

1. The `ghost` variant tints the Memphis shadow via
   `[--memphis-shadow-color:var(--primary)]`. Should this be promoted
   to a documented "tinted shadow" recipe so other components can
   adopt it consistently (e.g. for an info-tinted card hover)?
2. `outline` and `link` skip the `data-[state=open]` mirror by design,
   but this means using them as a Radix Popper trigger gives no visual
   "open" affordance at all. Should `outline` get a subtle press, or
   is the silence intentional?
3. The size scale (`sm/md/lg/icon`) is duplicated across IconButton,
   InputField, etc. — worth extracting a shared `sizeVariants` map
   once a few more components are scanned, or premature abstraction
   for a copy-paste-distributed library?
