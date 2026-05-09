# NavItem

Status: documented · Last scan: 3a33508 · Sources:
`packages/ui/src/components/nav-item/{nav-item.tsx,nav-item.variants.ts,index.ts,nav-item.test.tsx,nav-item.tone-on-dark.test.ts}`,
`packages/ui/src/lib/selection-chrome.ts`.

## Summary

Sidebar / nav row primitive. Renders as `<a>` by default (polymorphic
via `as`), with optional left icon, optional end adornment, and an
**active state** that uses the lib's signature "selection chrome":
gradient + 1px inset outline + 3px left bar bleeding into the
sidebar's gutter. Two tones — `default` (light) and `onDark` (dark
sidebar) — that read from different token sets.

> Since gh-61 the selection-chrome class recipe is **factored into a
> single helper** at `packages/ui/src/lib/selection-chrome.ts`
> (`selectionChromeClasses(opts)`) shared with `DropdownMenuRadioItem`.
> NavItem invokes it twice (once per tone) with token-specific options.
> The helper is parametrized by attribute gate, gradient/outline tokens,
> mix percentages, bar inset, and bar color — see the DropdownMenu
> chapter for the radio-item invocation. The visual contract below is
> unchanged; only the source-of-truth has moved.

## Public API

| Export            | Kind                                          |
| ----------------- | --------------------------------------------- |
| `NavItem`         | `forwardRef<HTMLAnchorElement, NavItemProps>` |
| `NavItemProps`    | see below                                     |
| `navItemVariants` | (re-exported via index)                       |
| `NavItemVariants` | type                                          |

| Prop           | Type                                      | Default     | Notes                                          |
| -------------- | ----------------------------------------- | ----------- | ---------------------------------------------- |
| `as`           | `ElementType`                             | `'a'`       | For Next `<Link>` etc.                         |
| `active`       | `boolean`                                 | —           | Sets `aria-current="page"` (drives the chrome) |
| `tone`         | `'default' \| 'onDark'`                   | `'default'` |                                                |
| `icon`         | `ReactNode`                               | —           | 20×20 slot, opacity 80                         |
| `endAdornment` | `ReactNode`                               | —           | right-aligned slot                             |
| `className`    | `string`                                  | —           |                                                |
| …native        | `AnchorHTMLAttributes<HTMLAnchorElement>` | —           | Including `href`                               |

## Internal architecture

### Render layout

```jsx
<Component aria-current={active ? 'page' : undefined} className={navItemVariants({ tone })}>
  {icon && (
    <span className="inline-flex h-5 w-5 items-center justify-center opacity-80">{icon}</span>
  )}
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

When `aria-current="page"` the variant emits the chrome classes via
`selectionChromeClasses(opts)` plus a `text-foreground` override.
Helper invocation:

```ts
selectionChromeClasses({
  gate: 'aria-[current=page]',
  radiusToken: 'rounded-selection',
  gradientFrom: 'var(--primary)',
  gradientFromMix: 18,
  gradientTo: 'var(--secondary)',
  gradientToMix: 10,
  outlineToken: 'var(--primary)',
  outlineMix: 30,
  barColor: 'bg-primary',
  barInset: '-2px',
  barTop: '2',
  barBottom: '2',
})
```

Resolved visual contract:

1. **Text** → `text-foreground` (kept at the call-site, not part of the helper)
2. **Radius** → `rounded-selection` (10px from tokens)
3. **Background** → 135° gradient mixing 18% primary + 10% secondary
   into transparent (subtle wash)
4. **Inset 1px outline** → 30% primary tinted (`shadow-[inset_0_0_0_1px…]`)
5. **3px left bar** (`::before`):
   - `position: absolute`, `top-2 bottom-2`, `w-[3px]`,
     `rounded-[2px]`, `bg-primary`
   - **`left-[-2px]`** (passed as `barInset`) — bleeds 2px outside the
     rounded outline, into the sidebar's left rail/padding gutter.

Hover (when not active): `hover:text-foreground hover:bg-muted
hover:translate-x-0.5` — small 0.5px nudge to the right on hover for
tactile feel.

### Tone = `onDark`

Same helper, every token swapped to the `--nav-on-dark-*` set so the
theme generator's "Nav on dark" controls reach the gradient/outline/bar
layers (regression guard: `nav-item.tone-on-dark.test.ts`). The source
comment is explicit:

> Idle + hover colours read from the nav-on-dark identity tokens so
> the theme generator's "Nav on dark" controls actually theme the
> navbar — previously these were hardcoded to the default rgba/white
> and ignored token overrides.

Helper invocation (only the changed args vs. `default`):

```ts
selectionChromeClasses({
  ...
  gradientFrom: 'var(--nav-on-dark-accent-strong)',
  gradientFromMix: 22,
  gradientTo: 'var(--nav-on-dark-accent)',
  gradientToMix: 12,
  outlineToken: 'var(--nav-on-dark-accent-strong)',
  outlineMix: 30,
  barColor: 'bg-[var(--nav-on-dark-accent-strong)]',
  // gate, radiusToken, barInset/Top/Bottom unchanged from default tone
})
```

- Text → `var(--nav-on-dark-foreground)` (idle), `var(--nav-on-dark-foreground-strong)` (hover); active text override → `var(--nav-on-dark-accent)` (kept at the call-site)
- Hover bg → `bg-white/5` (5% white tint — fixed, not tokenized)
- Active gradient → `linear-gradient(135deg, color-mix(in oklab, var(--nav-on-dark-accent-strong) 22%, transparent), color-mix(in oklab, var(--nav-on-dark-accent) 12%, transparent))`
  — fully tokenized via the same color-mix oklab recipe used by Chip /
  Toast / Banner / Hint. Theme-generator edits to either accent reach
  the gradient layer. The `color-mix(in oklab, ...)` literal lives in
  the helper, not the variants file — the regression test reads both
  files (variants + helper) so neither can silently embed the legacy
  gold/plum rgba literals.
- Active inset outline → `--nav-on-dark-accent-strong` mixed 30% with transparent
- Active bar → `bg-[var(--nav-on-dark-accent-strong)]`

## Notes & gotchas

1. **`onDark` tone gradient was tokenized** (was hard-coded gold/plum
   `rgba(213,168,69,0.22), rgba(122,57,128,0.12)` until commit 54ba84c).
   Now reads from `--nav-on-dark-accent` and `--nav-on-dark-accent-strong`
   via `color-mix(in oklab, …)`. Theme-generator edits flow through.

2. **Active bar inset is `left-[-2px]`** in NavItem, but
   `left-1` in DropdownMenuRadioItem. The difference is intentional:
   NavItem sits inside a sidebar with a left padding gutter into
   which the bar bleeds; DropdownMenuRadioItem sits inside an
   `overflow-hidden` Content panel where a bleeding bar would be
   clipped. **Since gh-61** this is an explicit `barInset` argument
   to `selectionChromeClasses` — no longer a hidden fork between two
   copy-pasted blocks.

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

1. **`disabled` opacity-only** — consider `aria-disabled` auto-set
   (and pointer-events-none).
2. ~~**Active chrome shared with DropdownMenuRadioItem**~~ —
   **RESOLVED in gh-61 / PR #75.** The recipe now lives in
   `packages/ui/src/lib/selection-chrome.ts` as
   `selectionChromeClasses(opts)`, exported from `@damo/ui`. Both
   NavItem (default + onDark) and `DropdownMenuRadioItem` consume it.
   The bar-inset divergence is an explicit parameter, the
   `color-mix(in oklab, …)` literal lives only in the helper, and a
   source-contract regression test pins the literal out of both
   call-sites.
3. **`hover:translate-x-0.5` is decorative motion** — fine on a
   sidebar, may feel jarring elsewhere. The component doesn't gate
   it; consumers wanting static items override.
