# NavItem

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/nav-item/{nav-item.tsx,nav-item.variants.ts,index.ts,nav-item.test.tsx}`.

## Summary

Sidebar / nav row primitive. Renders as `<a>` by default (polymorphic
via `as`), with optional left icon, optional end adornment, and an
**active state** that uses the lib's signature "selection chrome":
gradient + 1px inset outline + 3px left bar bleeding into the
sidebar's gutter. Two tones — `default` (light) and `onDark` (dark
sidebar) — that read from different token sets.

> **The selection chrome here is the canonical reference**;
> DropdownMenuRadioItem mirrors it intentionally for cross-component
> consistency (see DropdownMenu chapter).

## Public API

| Export             | Kind |
|--------------------|------|
| `NavItem`          | `forwardRef<HTMLAnchorElement, NavItemProps>` |
| `NavItemProps`     | see below |
| `navItemVariants`  | (re-exported via index) |
| `NavItemVariants`  | type |

| Prop           | Type                          | Default     | Notes |
|----------------|-------------------------------|-------------|-------|
| `as`           | `ElementType`                 | `'a'`       | For Next `<Link>` etc. |
| `active`       | `boolean`                     | —           | Sets `aria-current="page"` (drives the chrome) |
| `tone`         | `'default' \| 'onDark'`       | `'default'` | |
| `icon`         | `ReactNode`                   | —           | 20×20 slot, opacity 80 |
| `endAdornment` | `ReactNode`                   | —           | right-aligned slot |
| `className`    | `string`                      | —           | |
| …native        | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | Including `href` |

## Internal architecture

### Render layout

```jsx
<Component aria-current={active ? 'page' : undefined}
           className={navItemVariants({ tone })}>
  {icon && <span className="inline-flex h-5 w-5 items-center justify-center opacity-80">{icon}</span>}
  <span className="flex-1 truncate">{children}</span>
  {endAdornment && <span className="ml-auto shrink-0">{endAdornment}</span>}
</Component>
```

Three slots: icon (left), label (flex-1, truncates on overflow),
endAdornment (right). The label uses `truncate` so long labels stay
on one line with `…`.

### Base classes (shared across tones)

```
relative flex items-center gap-3 w-full text-left
px-3 py-2.5 text-sm font-medium
font-body cursor-pointer
transition-[background,color,transform] duration-fast
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
disabled:opacity-50 disabled:pointer-events-none
```

### Tone = `default` (selection chrome)

When `aria-current="page"`:

1. **Text** → `text-foreground`
2. **Radius** → `rounded-selection` (10px from tokens)
3. **Background** → 135° gradient mixing 18% primary + 10% secondary
   into transparent (subtle wash)
4. **Inset 1px outline** → 30% primary tinted (`shadow-[inset_0_0_0_1px…]`)
5. **3px left bar** (`::before`):
   - `position: absolute`, `top-2 bottom-2`, `w-[3px]`,
     `rounded-[2px]`, `bg-primary`
   - **`left-[-2px]`** — bleeds 2px outside the rounded outline,
     into the sidebar's left rail/padding gutter

Hover (when not active): `hover:text-foreground hover:bg-muted
hover:translate-x-0.5` — small 0.5px nudge to the right on hover for
tactile feel.

### Tone = `onDark`

The same shape, but every token is swapped to the `--nav-on-dark-*`
set. The source comment is explicit:

> Idle + hover colours read from the nav-on-dark identity tokens so
> the theme generator's "Nav on dark" controls actually theme the
> navbar — previously these were hardcoded to the default rgba/white
> and ignored token overrides.

- Text → `var(--nav-on-dark-foreground)` (idle), `var(--nav-on-dark-foreground-strong)` (hover/active)
- Hover bg → `bg-white/5` (5% white tint — fixed, not tokenized)
- Active gradient → `linear-gradient(135deg, rgba(213,168,69,0.22), rgba(122,57,128,0.12))`
  — **fixed gold/plum literals**, not tokens. Worth noting.
- Active inset outline → `--nav-on-dark-accent-strong` mixed 30% with transparent
- Active bar → `bg-[var(--nav-on-dark-accent-strong)]`

## Notes & gotchas

1. **`onDark` tone has hard-coded gold/plum gradient literals**
   (`rgba(213,168,69,0.22), rgba(122,57,128,0.12)`). These do **not**
   read from `--nav-on-dark-*` tokens — only the foreground / accent
   colors do. Theme-generator changes to gold/plum won't update the
   gradient. Worth flagging — see Open questions.

2. **Active bar inset is `left-[-2px]`** in NavItem, but
   `left-1` in DropdownMenuRadioItem. The difference is intentional:
   NavItem sits inside a sidebar with a left padding gutter into
   which the bar bleeds; DropdownMenuRadioItem sits inside an
   `overflow-hidden` Content panel where a bleeding bar would be
   clipped.

3. **`aria-current="page"` drives the chrome** via the
   `aria-[current=page]:` Tailwind variants. There is no `data-active`
   alternative — the prop maps directly to the ARIA attribute.

4. **`disabled` opacity-50** but no native disabled attribute on
   `<a>`. Consumers wanting truly inert items either wrap or use
   `aria-disabled` — not auto-applied.

5. **`as` prop for routing.** Pair with Next's `<Link>` or React
   Router's `<NavLink>`:
   `<NavItem as={Link} href="/foo" active={pathname === '/foo'}>…</NavItem>`.

## How to consume (shadcn-style copy)

1. Copy the whole `nav-item/` folder.
2. For the dark tone to theme correctly, ensure `--nav-on-dark-*`
   tokens exist in the consumer's stylesheet.
3. For the active gradient on dark, replace the rgba literals with
   token-based equivalents if you want consumer-themable.

## Open questions

1. **Hard-coded gold/plum gradient on `onDark` active** — defeats
   the theming intent for that tone. Worth replacing with
   `color-mix(in oklab, var(--nav-on-dark-accent-strong) X%, transparent)`
   or similar.
2. **`disabled` opacity-only** — consider `aria-disabled` auto-set
   (and pointer-events-none).
3. **Active chrome shared with DropdownMenuRadioItem** — the recipe
   should live in one place. A `selectionChrome()` cn-helper or a
   shared CSS class would prevent drift.
4. **`hover:translate-x-0.5` is decorative motion** — fine on a
   sidebar, may feel jarring elsewhere. The component doesn't gate
   it; consumers wanting static items override.
