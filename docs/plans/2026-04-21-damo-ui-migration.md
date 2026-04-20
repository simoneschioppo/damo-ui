# Damo UI — Full Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Fresh implementer subagent per task + spec review + code-quality review. Model: Opus 4.7 for implementers and reviewers. Every task uses TDD (tdd-workflow): write failing test → implement → green → refactor → commit.

**Goal:** Rename `damo-ui` / `@simoneschioppo/damo-ui` to `damo-ui` / `@simoneschioppo/damo-ui`, decouple the lib from the Damacchi game (rename 5 domain cards), extract the playground chrome (TopBar + switchers + hook) into the lib, add 5 agnostic mock preview pages, rewrite `/theme-generator` as a full token editor with live preview, and fix the `/design-system` dark-mode regression.

**Architecture:** Each component stays file-per-responsibility (≤400 LOC). Zero hex literals outside `tokens.css` + test fixtures. Every component: `forwardRef`, `cn(className)`, `...rest` spread. Theme-generator state is a single immutable object; mutations go through `setTheme` + `applyThemeToRoot`. Rename is atomic — no compat shim for `@simoneschioppo/damo-ui`.

**Tech Stack:** TypeScript strict, Tailwind v4, CVA, Radix UI (only where behavior is needed), Vitest + @testing-library, Playwright, pnpm workspace monorepo.

---

## Files we'll touch

### New lib files

- `packages/ui/src/components/app-top-bar/` (tsx, test, index)
- `packages/ui/src/components/theme-switcher/` (tsx, test, index)
- `packages/ui/src/components/palette-switcher/` (tsx, test, index)
- `packages/ui/src/hooks/use-persisted-attr.ts` + test + re-export in `hooks/index.ts`
- `packages/ui/src/mocks/gallery-preview/` (tsx, test, index)
- `packages/ui/src/mocks/auth-preview/` (tsx, test, index)
- `packages/ui/src/mocks/dashboard-preview/` (tsx, test, index)
- `packages/ui/src/mocks/profile-preview/` (tsx, test, index)
- `packages/ui/src/mocks/feed-preview/` (tsx, test, index)
- `packages/ui/src/mocks/index.ts` (sub-entrypoint barrel)

### Renamed lib files (same content, new paths + identifiers)

- `packages/ui/src/components/player-card/` → `user-card/` + rewrite Props
- `packages/ui/src/components/mode-card/` → `feature-card/`
- `packages/ui/src/components/info-card/` → `tooltip-card/`
- `packages/ui/src/components/rule-card/` → `article-card/`
- `packages/ui/src/components/medal/medal.tsx` — prop `rankNumber` → `value?: ReactNode`

### Rewrite

- `apps/playground/app/theme-generator/page.tsx` (full rewrite)
- `apps/playground/app/design-system/page.tsx` (rename refs + dark fix)
- `apps/playground/app/layout.tsx` (use `AppTopBar`)

### Delete

- `apps/playground/components/TopBar.tsx`
- `apps/playground/components/ThemeSwitcher.tsx`
- `apps/playground/components/PaletteSwitcher.tsx`
- `apps/playground/lib/use-persisted-attr.ts` + test

### Bulk modified (rename sweep)

- `packages/ui/package.json` (name, description, repository, publishConfig)
- `apps/playground/package.json` (dependency)
- `README.md`, `CHANGELOG.md`
- All `docs/specs/*.md`, `docs/plans/*.md`
- All imports `from '@simoneschioppo/damo-ui'` → `from '@simoneschioppo/damo-ui'` (grep + replace)
- `.github/workflows/ci.yml` if it references the package name
- `e2e/tests/**/*.ts` if any test imports types from the lib

### GitHub / git

- `gh repo rename damo-ui`
- `git remote set-url origin https://github.com/simoneschioppo/damo-ui.git`

---

## Task breakdown

### Task 1: Rename scope + repo (atomic sweep)

**Files:**
- Modify: `packages/ui/package.json`
- Modify: `apps/playground/package.json`
- Modify: `packages/ui/src/` (imports) — there are no such imports (lib is self-contained via relative paths)
- Modify: `apps/playground/**/*.tsx` — every `from '@simoneschioppo/damo-ui'` becomes `from '@simoneschioppo/damo-ui'`
- Modify: `e2e/tests/**/*.ts` — if any
- Modify: `README.md`, `CHANGELOG.md`, `docs/**/*.md`
- Modify: `.github/workflows/ci.yml` (if referenced)
- Git remote rename + GitHub repo rename

- [ ] **Step 1: grep to enumerate imports**

```bash
grep -rln "@simoneschioppo/damo-ui" apps packages e2e docs README.md CHANGELOG.md 2>/dev/null
```

Expected: ~30 matches.

- [ ] **Step 2: grep to enumerate README / metadata**

```bash
grep -rln "damo-ui\|@damacchi\|Damo UI" README.md CHANGELOG.md docs packages/ui/package.json apps/playground/package.json
```

- [ ] **Step 3: package.json updates**

```diff
// packages/ui/package.json
- "name": "@simoneschioppo/damo-ui",
+ "name": "@simoneschioppo/damo-ui",
- "description": "Memphis-inspired React component library",
+ "description": "Damo UI — a React component library heavily inspired by Memphis Design",
  "repository": {
    "type": "git",
-   "url": "https://github.com/simoneschioppo/damo-ui.git",
+   "url": "https://github.com/simoneschioppo/damo-ui.git",
    "directory": "packages/ui"
  }
```

```diff
// apps/playground/package.json
  "dependencies": {
-   "@simoneschioppo/damo-ui": "workspace:*",
+   "@simoneschioppo/damo-ui": "workspace:*",
  }
```

- [ ] **Step 4: apply sed-style rename across the tree**

```bash
# Files to update
rg -l "@simoneschioppo/damo-ui" apps packages e2e docs | while read f; do
  sed -i '' 's|@simoneschioppo/damo-ui|@simoneschioppo/damo-ui|g' "$f"
done

rg -l "damo-ui\|Damo UI" README.md CHANGELOG.md docs | while read f; do
  sed -i '' -e 's|damo-ui|damo-ui|g' -e 's|Damo UI|Damo UI|g' "$f"
done
```

(Implementer: use Edit / Write with exact string replacement, don't shell out sed in CI — do it per file.)

- [ ] **Step 5: pnpm install to refresh workspace linkage**

```bash
pnpm install
```

Expected: no errors, new symlink `node_modules/@simoneschioppo/damo-ui` → `packages/ui`.

- [ ] **Step 6: typecheck + lint + tests — all green**

```bash
pnpm -r typecheck && pnpm -r lint && pnpm -r test
```

If any test or type fails due to a lingering `@simoneschioppo/damo-ui` reference, fix and re-run.

- [ ] **Step 7: GitHub repo rename**

```bash
gh repo rename damo-ui --repo simoneschioppo/damo-ui
git remote set-url origin https://github.com/simoneschioppo/damo-ui.git
git remote -v  # verify
```

- [ ] **Step 8: commit + push**

```bash
git add -A
git commit -m "chore: rename damo-ui → damo-ui, @simoneschioppo/damo-ui → @simoneschioppo/damo-ui"
git push
```

Acceptance: `grep -r "@damacchi" apps packages docs e2e README.md CHANGELOG.md` returns zero matches.

---

### Task 2: Rename 5 domain cards → generic

**Files:**
- Rename folder: `packages/ui/src/components/player-card/` → `user-card/`
- Rename folder: `packages/ui/src/components/mode-card/` → `feature-card/`
- Rename folder: `packages/ui/src/components/info-card/` → `tooltip-card/`
- Rename folder: `packages/ui/src/components/rule-card/` → `article-card/`
- Modify: `packages/ui/src/components/medal/medal.tsx` (prop rename)
- Modify: `packages/ui/src/index.ts` (barrel)
- Modify: `apps/playground/app/design-system/page.tsx` (call sites)

#### 2a. `PlayerCard` → `UserCard` (API change)

- [ ] **Step 1: Write failing test** `packages/ui/src/components/user-card/user-card.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { UserCard } from './user-card'

describe('UserCard', () => {
  it('renders name and meta', () => {
    render(<UserCard name="Marina Rossi" meta="marina@acme.io · joined 2024" />)
    expect(screen.getByText('Marina Rossi')).toBeInTheDocument()
    expect(screen.getByText('marina@acme.io · joined 2024')).toBeInTheDocument()
  })
  it('renders trailing slot when provided', () => {
    render(<UserCard name="Marina" meta="m@a" trailing={<span>05:42</span>} />)
    expect(screen.getByText('05:42')).toBeInTheDocument()
  })
  it('renders custom avatar when provided', () => {
    render(<UserCard name="Marina" avatar={<span data-testid="av">A</span>} />)
    expect(screen.getByTestId('av')).toBeInTheDocument()
  })
  it('generates initial avatar fallback when none provided', () => {
    render(<UserCard name="Marina" />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })
  it('forwards className', () => {
    const { container } = render(<UserCard name="X" className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })
})
```

- [ ] **Step 2: Verify FAIL**

`pnpm --filter @simoneschioppo/damo-ui test user-card -- --run` → fail (no such module).

- [ ] **Step 3: Rename folder + rewrite component**

```bash
git mv packages/ui/src/components/player-card packages/ui/src/components/user-card
```

`packages/ui/src/components/user-card/user-card.tsx`:

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  meta?: ReactNode
  avatar?: ReactNode
  trailing?: ReactNode
}

export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(function UserCard(
  { name, meta, avatar, trailing, className, ...rest },
  ref,
) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-4 p-4 bg-surface text-ink',
        'border-2 border-border-memphis',
        className,
      )}
      style={{ boxShadow: '4px 4px 0 var(--border-memphis)' }}
      {...rest}
    >
      <div
        className={cn(
          'shrink-0 w-12 h-12 rounded-full',
          'bg-plum-900 text-paper-50 grid place-items-center font-display text-xl',
          'border-2 border-border-memphis',
        )}
      >
        {avatar ?? initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[15px] text-ink truncate">{name}</div>
        {meta ? (
          <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-muted mt-0.5">
            {meta}
          </div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  )
})
```

Update `packages/ui/src/components/user-card/index.ts`:

```ts
export { UserCard, type UserCardProps } from './user-card'
```

- [ ] **Step 4: update barrel `packages/ui/src/index.ts`**

```diff
- export { PlayerCard, type PlayerCardProps } from './components/player-card'
+ export { UserCard, type UserCardProps } from './components/user-card'
```

- [ ] **Step 5: verify tests PASS + typecheck**

```bash
pnpm --filter @simoneschioppo/damo-ui test user-card -- --run
pnpm --filter @simoneschioppo/damo-ui typecheck
```

- [ ] **Step 6: commit**

```bash
git add packages/ui/src/components/user-card packages/ui/src/index.ts
git commit -m "refactor(ui): rename PlayerCard → UserCard with slot-based API"
```

#### 2b–2d. Identical pattern for `ModeCard → FeatureCard`, `InfoCard → TooltipCard`, `RuleCard → ArticleCard`

Same workflow: write test (rename imports in test file), `git mv`, rewrite component with new name (no API change beyond identifier), update barrel, verify.

One commit per rename:
- `refactor(ui): rename ModeCard → FeatureCard`
- `refactor(ui): rename InfoCard → TooltipCard`
- `refactor(ui): rename RuleCard → ArticleCard`

#### 2e. `Medal` prop rename `rankNumber` → `value`

- [ ] **Step 1: Update test** in `medal.test.tsx`

Replace every `rankNumber={3}` with `value={3}`. Add one case: `<Medal rank="master" value="M" />` renders `"M"` inside the SVG.

- [ ] **Step 2: Verify FAIL** (prop doesn't exist yet).

- [ ] **Step 3: Update `medal.tsx`**

```diff
export interface MedalProps {
  rank: MedalRank
  label?: string
- rankNumber?: number
+ value?: ReactNode
  size?: number
  className?: string
}
```

Inside SVG `<text>`: render `{value}` instead of `{rankNumber}`. Remove numeric coercion.

- [ ] **Step 4: verify PASS + typecheck**

- [ ] **Step 5: commit**

```bash
git add packages/ui/src/components/medal
git commit -m "refactor(ui): Medal rankNumber prop → value ReactNode (supports letters)"
```

#### 2f. Update call sites in `/design-system`

- [ ] **Step 1: find call sites**

```bash
rg -n "PlayerCard|ModeCard|InfoCard|RuleCard|rankNumber" apps/playground
```

- [ ] **Step 2: Replace in `apps/playground/app/design-system/page.tsx`**

```diff
- import { PlayerCard, ModeCard, InfoCard, RuleCard, Medal } from '@simoneschioppo/damo-ui'
+ import { UserCard, FeatureCard, TooltipCard, ArticleCard, Medal } from '@simoneschioppo/damo-ui'
```

Update every JSX usage; for `UserCard` adapt to the new slot API.

- [ ] **Step 3: Typecheck + dev server smoke test**

```bash
pnpm --filter @damacchi/playground typecheck
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/design-system  # expect 200
```

- [ ] **Step 4: commit**

```bash
git add apps/playground/app/design-system/page.tsx
git commit -m "refactor(playground): DS page uses renamed generic components"
```

---

### Task 3: Migrate playground chrome into the lib

#### 3a. `<AppTopBar>` (new component)

**Files:**
- Create: `packages/ui/src/components/app-top-bar/app-top-bar.tsx` + test + index
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Test** (`app-top-bar.test.tsx`)

```tsx
import { render, screen } from '@testing-library/react'
import { AppTopBar } from './app-top-bar'

describe('AppTopBar', () => {
  it('renders logo + nav + actions slots', () => {
    render(
      <AppTopBar
        logo={<span>LOGO</span>}
        nav={<span>NAV</span>}
        actions={<span>ACT</span>}
      />,
    )
    expect(screen.getByText('LOGO')).toBeInTheDocument()
    expect(screen.getByText('NAV')).toBeInTheDocument()
    expect(screen.getByText('ACT')).toBeInTheDocument()
  })
  it('omits nav and actions when not passed', () => {
    render(<AppTopBar logo={<span>L</span>} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
  it('applies sticky by default, opt-out via sticky={false}', () => {
    const { container, rerender } = render(<AppTopBar logo={<span>L</span>} />)
    expect(container.firstChild).toHaveClass('sticky')
    rerender(<AppTopBar logo={<span>L</span>} sticky={false} />)
    expect(container.firstChild).not.toHaveClass('sticky')
  })
  it('forwards className', () => {
    const { container } = render(<AppTopBar logo={<span>L</span>} className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })
})
```

- [ ] **Step 2: FAIL** (module missing)

- [ ] **Step 3: Implement**

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface AppTopBarProps extends HTMLAttributes<HTMLElement> {
  logo: ReactNode
  nav?: ReactNode
  actions?: ReactNode
  sticky?: boolean
}

export const AppTopBar = forwardRef<HTMLElement, AppTopBarProps>(function AppTopBar(
  { logo, nav, actions, sticky = true, className, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-6 flex-wrap px-6 py-3',
        'border-b-2 border-border-memphis bg-surface text-ink',
        sticky && 'sticky top-0 z-sticky',
        className,
      )}
      {...rest}
    >
      <div className="font-display text-xl tracking-wider">{logo}</div>
      {nav ? <nav className="flex gap-6">{nav}</nav> : null}
      {actions ? <div className="flex gap-4 items-center flex-wrap">{actions}</div> : null}
    </header>
  )
})
```

- [ ] **Step 4: Verify PASS**

- [ ] **Step 5: Export in barrel**

```ts
export { AppTopBar, type AppTopBarProps } from './components/app-top-bar'
```

- [ ] **Step 6: commit**

```bash
git add packages/ui/src/components/app-top-bar packages/ui/src/index.ts
git commit -m "feat(ui): add AppTopBar with logo/nav/actions slots"
```

#### 3b. `<ThemeSwitcher>` (moved + generalized)

**Files:**
- Create: `packages/ui/src/components/theme-switcher/theme-switcher.tsx` + test + index
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeSwitcher } from './theme-switcher'

describe('ThemeSwitcher', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.clear()
  })
  it('renders default light/dark options', () => {
    render(<ThemeSwitcher />)
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
  })
  it('toggles data-theme on <html> when clicked', () => {
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByRole('button', { name: /dark/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
  it('persists to localStorage', () => {
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByRole('button', { name: /dark/i }))
    expect(localStorage.getItem('theme')).toBe('dark')
  })
  it('respects custom options', () => {
    render(<ThemeSwitcher options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement** (re-using `usePersistedAttr` from Task 3d; if that's not ready yet, inline the hook here and refactor during 3d)

```tsx
'use client'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { usePersistedAttr } from '../../hooks/use-persisted-attr'

export interface ThemeOption { value: string; label: string }

export interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  options?: ReadonlyArray<ThemeOption>
  storageKey?: string
  attribute?: string
  defaultValue?: string
}

const DEFAULT_OPTIONS: ReadonlyArray<ThemeOption> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(function ThemeSwitcher(
  {
    options = DEFAULT_OPTIONS,
    storageKey = 'theme',
    attribute = 'data-theme',
    defaultValue = 'light',
    className,
    ...rest
  },
  ref,
) {
  const [value, setValue] = usePersistedAttr(storageKey, attribute, defaultValue)
  return (
    <div ref={ref} className={cn('inline-flex gap-2 items-center', className)} {...rest}>
      <span className="eyebrow">Theme</span>
      <div className="inline-flex border-2 border-border-memphis">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue(opt.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-semibold capitalize cursor-pointer',
              value === opt.value
                ? 'bg-plum-500 text-paper-50'
                : 'bg-surface text-ink',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
})
```

- [ ] **Step 4: PASS + export + commit** `feat(ui): add ThemeSwitcher with customizable options`

#### 3c. `<PaletteSwitcher>`

**Files:**
- Create: `packages/ui/src/components/palette-switcher/palette-switcher.tsx` + test + index
- Modify: barrel

Mirror structure of 3b. Tests cover: renders options, writes `data-palette`, persists, sanitizes legacy values.

Commit: `feat(ui): add PaletteSwitcher with caller-provided options`.

#### 3d. `usePersistedAttr` hook (moved into lib)

**Files:**
- Create: `packages/ui/src/hooks/use-persisted-attr.ts` (same content as `apps/playground/lib/use-persisted-attr.ts`)
- Create: `packages/ui/src/hooks/use-persisted-attr.test.ts`
- Modify: `packages/ui/src/hooks/index.ts` (export alongside `useResolvedCssVars`)
- Modify: `packages/ui/src/index.ts` (barrel)

- [ ] Copy file content from playground. Adapt test from `apps/playground/lib/use-persisted-attr.test.tsx`.
- [ ] Export from lib barrel: `export { usePersistedAttr } from './hooks/use-persisted-attr'`.
- [ ] Commit: `feat(ui): expose usePersistedAttr from lib`.

#### 3e. Rewrite `apps/playground/app/layout.tsx` to use the lib

```tsx
import Link from 'next/link'
import {
  AppTopBar,
  ThemeSwitcher,
  PaletteSwitcher,
} from '@simoneschioppo/damo-ui'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" data-theme="light" data-palette="plum-gold" suppressHydrationWarning>
      <head>{/* fonts */}</head>
      <body suppressHydrationWarning>
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
                defaultValue="plum-gold"
                options={[
                  { value: 'plum-gold', label: 'Plum+Gold' },
                  { value: 'neon', label: 'Neon' },
                  { value: 'sunset', label: 'Sunset' },
                ]}
              />
            </>
          }
        />
        {children}
      </body>
    </html>
  )
}
```

Commit: `refactor(playground): layout uses lib AppTopBar + switchers`.

#### 3f. Delete local components

```bash
git rm apps/playground/components/TopBar.tsx
git rm apps/playground/components/ThemeSwitcher.tsx
git rm apps/playground/components/PaletteSwitcher.tsx
git rm apps/playground/lib/use-persisted-attr.ts apps/playground/lib/use-persisted-attr.test.tsx
rmdir apps/playground/components apps/playground/lib 2>/dev/null || true
```

Commit: `chore(playground): remove local chrome after lib migration`.

Verify: `pnpm -r typecheck && pnpm -r lint && pnpm -r test` all green; `curl http://localhost:3000/design-system` returns 200.

---

### Task 4: Mock preview pages

**Files:** for each mock, create `packages/ui/src/mocks/<name>-preview/{<name>-preview.tsx, <name>-preview.test.tsx, index.ts}`.

Create `packages/ui/src/mocks/index.ts`:

```ts
export { GalleryPreview } from './gallery-preview'
export { AuthPreview } from './auth-preview'
export { DashboardPreview } from './dashboard-preview'
export { ProfilePreview } from './profile-preview'
export { FeedPreview } from './feed-preview'
```

Add to `packages/ui/package.json#exports`:

```json
"./mocks": {
  "types": "./dist/mocks/index.d.ts",
  "import": "./dist/mocks/index.js"
}
```

Add to tsup build so `dist/mocks/index.js` exists (update `tsup.config.ts` entries).

Per-mock steps (×5):

- [ ] Write test (renders without error, exposes key text like "Bentornato" / "Dashboard" / "Profilo" / "Progetto Alpha" / "Primary").
- [ ] Implement using only lib primitives (`Button`, `Input`, `Label`, `Card`, `Badge`, `Chip`, `Avatar`, `Stat`, etc.). Zero hex, zero inline borders.
- [ ] Export in `mocks/index.ts`.
- [ ] Commit per mock: `feat(ui): add <Name>Preview mock`.

After all 5: commit `chore(ui): expose /mocks subpath entrypoint` if tsup config changed.

---

### Task 5: Theme Generator v2

**Files:**
- Rewrite: `apps/playground/app/theme-generator/page.tsx`
- Create: `apps/playground/app/theme-generator/theme-state.ts` (state model + defaults + exporters)
- Create: `apps/playground/app/theme-generator/exporters.ts` (buildCssExport, buildTailwindExport, buildJsonExport, buildFigmaExport)
- Create: `apps/playground/app/theme-generator/presets.ts` (Plum+Gold / Neon / Sunset as Theme objects)

- [ ] **Step 1: Define TypeScript types** for the Theme state (per spec §5.5). Put in `theme-state.ts`.
- [ ] **Step 2: Write preset values** matching current `tokens.css` + `themes.css` in `presets.ts`.
- [ ] **Step 3: Implement `applyThemeToRoot` / `resetRootTheme` / `useThemeState` hook** backed by a single `useReducer`.
- [ ] **Step 4: Implement 4 exporters** (pure functions taking Theme → string). Add unit tests in `exporters.test.ts` (standalone vitest; no React needed).
- [ ] **Step 5: Build the page**

```tsx
'use client'
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Button, ColorPicker, Container, Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  GalleryPreview, AuthPreview, DashboardPreview, ProfilePreview, FeedPreview,
  Slider, Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@simoneschioppo/damo-ui'
// + local hooks / reducer

export default function ThemeGeneratorPage() {
  const { theme, updateToken, loadPreset, reset, darkPreview, setDarkPreview, activePreset } = useThemeState()
  const [sceneTab, setSceneTab] = useState('gallery')
  const [exportOpen, setExportOpen] = useState(false)
  // ...
}
```

The layout = a two-column CSS grid (320px / 1fr). Inside sidebar: an `<Accordion>` with 6 sections, each rendering the right set of editors (ColorPicker for colors, Slider for numerics, Select for typography/easing). Inside preview pane: a `<Tabs>` with 5 scenes. Bottom of sidebar: `Preset` select, `Reset`, `Export` button that opens a `<Dialog>` with `<Tabs>` showing each of the 4 export formats + Copy button.

- [ ] **Step 6: playwright screenshots** for each of the 5 scenes × 2 themes (10 snapshots) as regression baseline.
- [ ] **Step 7: typecheck + lint + commit**

```bash
git add apps/playground/app/theme-generator
git commit -m "feat(playground): rewrite theme-generator as full token editor with live preview"
```

Further sub-steps (live-edit behavior):
- [ ] Every `updateToken` call writes the new value to `:root` via `setProperty` — the preview updates live
- [ ] On unmount, the reducer dispatches `resetRootTheme()` to avoid polluting other routes
- [ ] `loadPreset(name)` dispatches `LOAD_PRESET` which overwrites state and marks `activePreset`
- [ ] `reset()` re-applies `activePreset` values (not the hardcoded default)
- [ ] `darkPreview` toggle sets `data-theme="dark"` on the preview pane only (via a `data-theme-preview` attribute on the preview div, plus a local CSS block that scopes the override)

---

### Task 6: Dark mode fix on `/design-system`

**Files:**
- Modify: `apps/playground/app/design-system/page.tsx`

- [ ] **Step 1: grep every `var(--paper-50)` / `var(--plum-*)` in the page and classify** — which are genuinely brand-static (e.g. a color swatch showing the Plum scale) vs. which should be semantic (the page background, the TOC sidebar background).
- [ ] **Step 2: Rewrite `pageStyle`**

```diff
- background: 'var(--paper-50)',
+ background: 'var(--bg)',
```

- [ ] **Step 3: Rewrite `tocStyle`**

```diff
- background: 'var(--plum-900)',
+ background: 'var(--surface-2)',
- color: '#fff',
+ color: 'var(--ink)',
```

- [ ] **Step 4: Hero decor stroke colors** — swap `#2a0f2d` / `#7a3980` hardcoded fallbacks for `var(--ink)` / `var(--accent)` where applicable. Keep the Plum scale swatches explicit (they demonstrate the palette, so they stay hardcoded).

- [ ] **Step 5: Visual regression** — `node /tmp/ds-zoom.mjs` (existing script) captures 4 combos; compare `light/plum-gold` vs `dark/plum-gold` — main-pane bg must differ, swatch content must be identical.

- [ ] **Step 6: Commit**

```bash
git add apps/playground/app/design-system/page.tsx
git commit -m "fix(playground): design-system page reacts to dark mode correctly"
```

---

### Task 7: Final polish + publish test

- [ ] **Step 1:** `pnpm --filter @simoneschioppo/damo-ui build` succeeds; `dist/index.d.ts` contains all new exports including `AppTopBar`, `ThemeSwitcher`, `PaletteSwitcher`, `usePersistedAttr`, `UserCard`, `FeatureCard`, `TooltipCard`, `ArticleCard`.
- [ ] **Step 2:** `pnpm --filter @simoneschioppo/damo-ui build:mocks` (or equivalent — add script) builds `dist/mocks/index.js` and `.d.ts`.
- [ ] **Step 3:** Verify `node -e "import('@simoneschioppo/damo-ui').then(m => console.log(Object.keys(m).sort()))"` (from the monorepo root via a temporary script) prints the full new API surface.
- [ ] **Step 4:** Dispatch `everything-claude-code:code-reviewer` across Tasks 2-6.
- [ ] **Step 5:** Dispatch `everything-claude-code:security-reviewer` focused on theme-generator exporters (no CSS injection via user-typed hex values) + `applyThemeToRoot` (CSS-var injection safe via `setProperty`).
- [ ] **Step 6:** Re-run `pnpm --filter @damacchi/e2e test` — all smoke specs green on chromium + webkit. Update `e2e/tests/scenarios/design-system-sections.spec.ts` if the section ids changed.
- [ ] **Step 7:** Push final:

```bash
git push
```

- [ ] **Step 8:** Attempt a dry-run publish to confirm registry config:

```bash
pnpm --filter @simoneschioppo/damo-ui publish --dry-run
```

Expected: "Would publish ... to https://npm.pkg.github.com" with no auth errors if env is set. If auth missing, document in README without failing the plan.

---

## Definition of Done

1. `grep -r "@damacchi\|damo-ui\|Damo UI" apps packages docs e2e README.md CHANGELOG.md | grep -v '.git\|node_modules\|dist\|\.superpowers'` → zero matches
2. `gh repo view simoneschioppo/damo-ui` succeeds; `git remote -v` shows the new URL
3. `pnpm -r typecheck && pnpm -r lint && pnpm -r test` green
4. `pnpm --filter @simoneschioppo/damo-ui test -- --run` — unit tests ≥ 220 passing (previous 189 + ~30 new mocks/switchers)
5. `pnpm --filter @damacchi/e2e test` — all scenarios pass on chromium + webkit
6. Visual diff (6 combos × 5 scenes) — no unexpected regressions; dark mode on `/design-system` no longer shows ivory main pane
7. `/theme-generator` round-trip works: pick Preset → tweak color → Export CSS → paste into `tokens.css` → reload → values persist
8. Code-review + security-review both return zero CRITICAL / HIGH
9. Final push accepted; repo remains private
