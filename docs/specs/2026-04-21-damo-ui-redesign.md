# Damo UI — Full Redesign Spec

**Context:** what was `@damo/ui` / `damo-ui` becomes **Damo UI**, a Memphis-inspired React component library that works as a standalone, generic UI toolkit. The playground is rewritten so every surface (pages + chrome) consumes only lib components. A new live-editing `theme-generator` replaces the current minimal one.

**Non-goals:** redesign the lib visual language (Memphis stays). Support CSS-in-JS. Ship to npm public.

**Status:** approved 2026-04-21.

---

## 1. Rename + ownership

**Repo:** `simoneschioppo/damo-ui` → `simoneschioppo/damo-ui`. Private.

**Package:** `@damo/ui` → `@damo/ui`. User-scope on GitHub Packages unlocks private publish without org setup.

**Brand line** (README, package.json description, HTML meta, CHANGELOG):

> Damo UI — a React component library heavily inspired by Memphis Design.

**Migration touchpoints** (not exhaustive, plan will enumerate):

- `packages/ui/package.json` — `name`, `description`, `repository`, `publishConfig.registry`
- `apps/playground/package.json` — dependency `@damo/ui` → `@damo/ui`
- All imports `from '@damo/ui'` → `from '@damo/ui'` (grep: ~30 occurrences)
- `README.md`, `CHANGELOG.md`, all `docs/specs/*.md`, all `docs/plans/*.md`
- `.github/workflows/ci.yml` if it references the package name
- GitHub repo rename via `gh repo rename damo-ui` (git remote auto-redirects, but we set it explicitly: `git remote set-url origin https://github.com/simoneschioppo/damo-ui.git`)

**No backwards-compat shim.** The old scope is gone in one atomic sweep.

---

## 2. Lib decoupling (domain → generic)

Existing domain-specific cards in the lib are renamed to neutral names so the library works as a standalone Damo UI library independent of any consumer app. No behavior change — only identifiers and copy in stories.

| Current      | New           | API change                                                                                                                                                           |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PlayerCard` | `UserCard`    | `{ name, avatar?, meta?: ReactNode, trailing?: ReactNode }` — removed `elo/mode/clock` props, replaced by free-form `meta` + `trailing` slots                        |
| `ModeCard`   | `FeatureCard` | `{ title, desc, meta?, icon? }` — unchanged props, renamed                                                                                                           |
| `InfoCard`   | `TooltipCard` | same props, renamed                                                                                                                                                  |
| `RuleCard`   | `ArticleCard` | same props, renamed                                                                                                                                                  |
| `Medal`      | `Medal`       | rename prop `rankNumber: number` → `value?: ReactNode` so both digits (1/2/3) and letters ("M", "GM") fit. Ranks stay: bronze / silver / gold / master / grandmaster |

Stories and the `/design-system` page are updated to the new names. The old names are removed from the barrel — no deprecation period (pre-1.0 library, no external consumers).

---

## 3. Playground components → lib

These live in `apps/playground/components/` today and contain Memphis-styled markup. They belong in the lib so any consumer can reuse them.

### 3.1 `<AppTopBar>` (new)

**Path:** `packages/ui/src/components/app-top-bar/`

```tsx
export interface AppTopBarProps extends HTMLAttributes<HTMLElement> {
  logo: ReactNode // consumer passes <Link href="/">brand</Link> or just text
  nav?: ReactNode // primary horizontal nav
  actions?: ReactNode // right-side slot (switchers, CTAs)
  sticky?: boolean // default true
}
```

Visual parity with current `TopBar.tsx`: 12px/24px padding, 2px border-memphis bottom, surface bg, flex with three slots, wraps on narrow viewports. No Next.js dependency — consumers pass their own link components.

### 3.2 `<ThemeSwitcher>` (moved from playground)

**Path:** `packages/ui/src/components/theme-switcher/`

```tsx
export interface ThemeSwitcherProps {
  storageKey?: string // default 'theme'
  attribute?: string // default 'data-theme'
  options?: ReadonlyArray<{ value: string; label: string }> // default [{light,Light},{dark,Dark}]
  className?: string
}
```

Renders a labeled segmented-control-ish toggle. Writes `attribute` on `document.documentElement`. Persists in `localStorage` under `storageKey`.

### 3.3 `<PaletteSwitcher>` (moved from playground)

**Path:** `packages/ui/src/components/palette-switcher/`

```tsx
export interface PaletteOption {
  value: string
  label: string
}
export interface PaletteSwitcherProps {
  options: ReadonlyArray<PaletteOption> // caller-provided; no Plum/Neon/Sunset hardcoded
  defaultValue?: string
  storageKey?: string // default 'palette'
  attribute?: string // default 'data-palette'
  className?: string
}
```

Same pattern as ThemeSwitcher but with a `<select>` and caller-defined options. Unknown stored values are sanitized to `defaultValue` (same behavior as today's playground).

### 3.4 `usePersistedAttr` hook (moved from playground)

**Path:** `packages/ui/src/hooks/use-persisted-attr.ts`

Signature unchanged from `apps/playground/lib/use-persisted-attr.ts`. Exported from the hooks barrel + top-level.

### 3.5 Playground post-migration

```tsx
// apps/playground/app/layout.tsx
<AppTopBar
  logo={<Link href="/">DAMO · UI</Link>}
  nav={
    <>
      <Link href="/design-system">Design System</Link>
      <Link href="/theme-generator">Theme Generator</Link>
    </>
  }
  actions={
    <>
      <ThemeSwitcher />
      <PaletteSwitcher
        options={[
          { value: 'plum-gold', label: 'Plum+Gold' },
          { value: 'neon', label: 'Neon' },
          { value: 'sunset', label: 'Sunset' },
        ]}
      />
    </>
  }
/>
```

Local `TopBar.tsx`, `ThemeSwitcher.tsx`, `PaletteSwitcher.tsx`, `lib/use-persisted-attr.ts` are deleted.

---

## 4. Mock preview pages (new sub-entrypoint)

**Path:** `packages/ui/src/mocks/` → exported as `@damo/ui/mocks`.

Five agnostic, self-contained preview components built only from lib primitives. They serve the theme-generator (as preview scenes) but can also be imported by any consumer for demos or screenshots.

```tsx
<GalleryPreview />     // every lib component in one grid
<AuthPreview />        // login form + OAuth
<DashboardPreview />   // KPI cards + bar chart + CTA
<ProfilePreview />     // avatar + badges + chips + achievements grid
<FeedPreview />        // search + filter chips + item list
```

**Rules:**

- Zero domain vocabulary. Copy is generic ("Bentornato", "Dashboard", "Marina Rossi", "Progetto Alpha").
- Zero page-level state besides what the components themselves carry.
- Work in light and dark.

The current `/design-system` page uses existing doc primitives (`SectionHeader`, `ShowcaseCard`, `TypeSpecimen`, etc.) — those stay; mocks are additive.

---

## 5. Theme Generator v2

**Route:** `/theme-generator` (rewrite).

### 5.1 Layout

Two-column sticky split:

```
┌─────────────────────────────────────────────────────────────┐
│  AppTopBar (unchanged)                                      │
├─────────────┬───────────────────────────────────────────────┤
│             │  [Gallery | Auth | Dashboard | Profilo | Feed]│
│  Tokens     │  ───────────────────────────────────────────  │
│  Accordion  │                                               │
│  (320px     │            Preview scene                      │
│  sticky)    │            (light/dark toggle)                │
│             │                                               │
│  [Export]   │                                               │
│  [Preset ▾] │                                               │
│  [Reset]    │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

### 5.2 Sidebar — token accordion

Six sections, one expanded at a time:

**Colors** — brand (`--plum-*`, `--gold-*`, `--paper-*`) + semantic (`--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-soft`, `--ink-muted`, `--border`, `--border-memphis`, `--accent`, `--ring`) + status (`--success`, `--danger`, `--warning`, `--info`). Each row = `<ColorPicker>` from the lib.

**Typography** — `--font-display`, `--font-body`, `--font-mono` (each a Google Fonts combobox with a live sample preview) + a size scale editor (numeric input per named size: `text-xs` through `text-3xl`) + weights (a stepped chip group: 300/400/500/600/700).

**Radius** — one slider per `--radius-{none,sm,md,lg,pill,full}` (0–32px, pill and full clamp to their extremes).

**Shadow** — one editor per `--shadow-memphis-{sm,md,lg,hover,active}` (x/y offset number inputs + color picker) + one per `--shadow-{sm,md,lg}` (simple softness slider over a fixed rgba formula).

**Spacing** — a global multiplier slider (0.5× – 2×) that scales `--space-*` en bloc + override per named step.

**Motion** — `--duration-{snap,fast,base,slow}` numeric ms + `--ease-memphis`, `--ease-out`, `--ease-in-out` dropdowns (cubic-bezier presets + custom).

All edits mutate `document.documentElement.style.setProperty('--x', value)` live. State stored in a single `theme` object in React state; on unmount all overrides are removed.

### 5.3 Preview — tabs top

Tab bar across the preview pane switches between:

1. **Gallery** — `<GalleryPreview />`
2. **Auth** — `<AuthPreview />`
3. **Dashboard** — `<DashboardPreview />`
4. **Profilo** — `<ProfilePreview />`
5. **Feed** — `<FeedPreview />`

Each scene is a lib mock (§4). No extra code per scene in the theme-generator itself.

### 5.4 Global actions

**Preset dropdown** — lists built-in presets: `Plum+Gold`, `Neon`, `Sunset`. Selecting one:

- applies the preset values to the state (and to `:root` via `setProperty`)
- marks it as the **active default** — the "Reset" button restores to this preset, not to `Plum+Gold`
- updates `data-palette` on `<html>` so the theme carries on if the user navigates away

**Reset button** — restores the currently active preset's values.

**Dark preview toggle** — an internal segmented switch `Light | Dark`. It temporarily overrides `data-theme` on the preview container (not the whole page), so the user sees light + dark side-by-side only if they toggle. Default matches the global topbar toggle.

**Export button** — opens a modal with **4 tabs**:

- **CSS** — `:root { --plum-500: #...; ... }` with a `Copy` button
- **Tailwind preset** — complete `tailwind.preset.ts` snippet referencing the tokens
- **JSON** — design tokens JSON (flat keys, matches the token schema)
- **Figma Tokens** — Figma Tokens Studio compatible JSON

All copies include a "Copied" toast confirmation (via lib `Toast`).

### 5.5 State model

```ts
type Theme = {
  colors: Record<ColorTokenKey, string>
  typography: {
    fontDisplay: string
    fontBody: string
    fontMono: string
    sizes: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl', number>
  }
  radius: Record<'none' | 'sm' | 'md' | 'lg' | 'pill' | 'full', number>
  shadow: {
    memphis: Record<
      'sm' | 'md' | 'lg' | 'hover' | 'active',
      { x: number; y: number; color: string }
    >
    soft: Record<'sm' | 'md' | 'lg', number>
  }
  spacing: { scale: number; overrides: Record<string, number> }
  motion: {
    durations: Record<'snap' | 'fast' | 'base' | 'slow', number>
    easings: Record<'memphis' | 'out' | 'in-out', string>
  }
}
```

Derived helpers:

- `applyThemeToRoot(theme)` — writes every key as a CSS custom property
- `resetRootTheme()` — unsets all tokens (falls back to `tokens.css` defaults)
- `buildCssExport(theme)`, `buildTailwindExport(theme)`, `buildJsonExport(theme)`, `buildFigmaExport(theme)`

---

## 6. Dark mode regression fix on `/design-system`

**Bug:** `apps/playground/app/design-system/page.tsx` hardcodes `pageStyle.background = 'var(--paper-50)'`. In dark mode this keeps the main pane ivory while the TOC flips, breaking the whole scheme.

**Fix:**

- `pageStyle.background` → `var(--bg)`
- `tocStyle.background` → `var(--surface-2)` (stays dark in both themes without the jarring pure-black of `var(--plum-900)`)
- Audit all remaining `var(--plum-*)`/`var(--paper-*)` uses in the page for theme-reactivity — they should be semantic (`--bg`, `--surface`, `--ink`) instead
- Regression test: Playwright screenshot diff per theme × palette (6 combos), fail if the main pane background differs from the expected `--bg` resolved value

---

## 7. Out of scope

- Publishing the renamed package to npm public (remains GitHub Packages private)
- Removing or changing the Memphis visual language
- Adding a CSS-in-JS runtime
- i18n of preview content

---

## 8. Acceptance criteria

1. `pnpm -r typecheck && pnpm -r lint && pnpm -r test` green
2. `pnpm --filter @damo/ui test` — existing 189+ unit tests still pass (renamed components included)
3. `pnpm --filter @damacchi/e2e test` — all scenarios pass on chromium + webkit (spec names updated where relevant)
4. `grep -r "@damacchi" apps packages docs e2e` returns zero matches
5. `/design-system` and `/theme-generator` render correctly in 6 theme × palette combos (screenshots archived)
6. `/theme-generator` can round-trip a theme: pick Preset → tweak → Export CSS → paste into `tokens.css` → reload → values persist
7. GitHub repo renamed, `git remote` points to new URL, latest commit pushed successfully
