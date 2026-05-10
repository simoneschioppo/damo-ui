# Spec — Locale-switch theme flash fix

Status: in-progress · Owner: simoneschioppo · Date: 2026-05-10 ·
Branch: `fix/locale-switch-theme-flash` · Type: bug fix (no GitHub
issue tracked yet — reported inline by the user).

## 1. Intent

Eliminate the visible flash of light theme that happens when the user
is in dark mode and switches the docs-site language via the
preferences popover. Same flash also happens on every cold reload of
any page when a non-default theme/palette/density is persisted — the
locale-change reload just makes it more salient because the user is
actively interacting.

## 2. Repro

1. Open `http://localhost:3000/`.
2. Open the cog → set Theme = Dark. Page goes dark immediately.
3. Open the cog → switch Language from English to Italiano.
4. Page reloads → **brief light-theme paint visible** → settles back
   to dark.

## 3. Root cause

Two layered causes:

### 3a. Server HTML hardcodes light defaults

`apps/web/app/layout.tsx:43-50` emits:

```tsx
<html
  lang={locale}
  data-locale={locale}
  data-theme="light"        // ← hardcoded
  data-palette="default"    // ← hardcoded
  data-density="normal"     // ← hardcoded
  suppressHydrationWarning
>
```

So the SSR'd HTML always has `data-theme="light"`. The CSS in
`globals.css` keys dark mode off `[data-theme='dark']`, so the first
paint after any reload is light — regardless of what the user
previously chose. Locale switch calls `window.location.reload()`
(`DocsPreferencesMenu.tsx:139`) so the user lands back on this
light-default HTML.

### 3b. `usePersistedAttr` hydrates from default, then catches up

`packages/ui/src/hooks/use-persisted-attr.ts` uses
`useState(defaultValue)` and reads localStorage in a `useEffect` that
runs **after** the first commit + paint. On mount the sequence is:

1. First commit with `value = 'light'` (the default).
2. Browser paints: light.
3. Effect 1 reads `localStorage.theme = 'dark'` → schedules a state
   update.
4. Effect 2 (DOM-write, declared after Effect 1) fires with the OLD
   `value = 'light'` → calls `setAttribute('data-theme', 'light')`.
5. React processes the queued state update → re-renders with
   `value = 'dark'`.
6. Effect 2 re-fires → `setAttribute('data-theme', 'dark')`.
7. Browser paints: dark.

Even if step 1 starts with the correct attribute (e.g. an inline
script applied 'dark' before paint), step 4 would clobber it. The hook
**must** initialize state in lockstep with whatever the script wrote,
otherwise the effect would undo the script's work mid-flight.

## 4. Fix approach

Two complementary, surgical changes — both required for a clean fix:

### 4a. FOUC prevention script (apps/web)

Add a synchronous inline `<script>` to `<head>` (before any CSS link)
that reads the three persisted preferences from `localStorage` with
strict allow-list validation, then writes them as data-attributes on
`document.documentElement` **before the first paint**. The script must
be:

- **Synchronous** (no `defer`/`async`/`type="module"`) so it blocks
  parsing until done — by the time the parser reaches `<link
rel="stylesheet">` and `<body>`, the attributes are correct.
- **Wrapped in try/catch** — Safari private mode, blocked storage,
  storage-quota-exceeded all throw on `localStorage.getItem`. We
  swallow and fall through to the server defaults (no flash, just no
  preference recovery).
- **Allow-list validated** — only known good values are applied. A
  manually tampered `localStorage.theme = "<script>...</script>"`
  cannot turn into a DOM attribute write of arbitrary content.

The injection uses `dangerouslySetInnerHTML` with a string literal
(no user-controlled interpolation), so React will not escape the
function body — what we wrote is what runs.

### 4b. Lazy init in `usePersistedAttr` (packages/ui)

Change `useState<T>(defaultValue)` to a lazy initializer that on the
client tries to read `localStorage[storageKey]` synchronously and
returns it (otherwise `defaultValue`). On the server (`typeof window
=== 'undefined'`) it still returns `defaultValue`, preserving SSR
output.

Why this is required even with the script: the script writes the DOM
attribute correctly, but React's hydration commits with `value =
defaultValue` and the existing post-paint `useEffect` would then
write the default back to the DOM — flashing once before the storage
read effect re-syncs. Lazy init makes the first commit's value match
the script's DOM write, so the post-paint effect is a no-op and the
attribute never flips.

Hydration mismatch concern: the React tree itself does not branch on
the hook's return value visibly during initial render. The only
consumer (`DocsPreferencesMenu`) renders the value through Popover
chips that mount lazily on open (Radix `Popover.Content` is gated
behind `data-state="open"`). The `<html>` data-attribute mismatch
between server and client is already silenced by the existing
`suppressHydrationWarning` on `<html>` and `<body>`.

## 5. Code map

| Area           | File                                               | What changes                                                               |
| -------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| FOUC script    | `apps/web/app/layout.tsx`                          | Add inline `<script>` in `<head>` (before fonts) with allow-list validate  |
| Lib hook       | `packages/ui/src/hooks/use-persisted-attr.ts`      | Convert `useState(defaultValue)` → lazy init reading localStorage on mount |
| Lib hook tests | `packages/ui/src/hooks/use-persisted-attr.test.ts` | Add a regression test asserting initial render value matches storage       |

Out of scope:

- The `window.location.reload()` strategy in `handleLocaleChange`
  stays — switching to `router.refresh()` is a separate UX
  optimisation.
- `usePersistedLocale.ts` already seeds from the server-resolved
  cookie (`initial`), which is correct after reload — no change.
- Adding palette/density/theme to the `NEXT_LOCALE` cookie family
  (server-side reading) — the FOUC script covers it without
  introducing a new cookie surface.

## 6. Acceptance criteria

- AC-1: After dark + IT are persisted, reloading any docs page paints
  dark on the first frame (no light flash).
- AC-2: After dark + EN are persisted, switching to IT reloads with
  no visible light flash.
- AC-3: `usePersistedAttr` first-render value reflects localStorage
  on the client when present (covered by a new vitest case).
- AC-4: Pre-existing tests in `use-persisted-attr.test.ts` continue
  to pass without modification.
- AC-5: The FOUC script tolerates `localStorage` throwing
  (`getItem` raise) — no uncaught error in the console; page renders
  with server defaults.
- AC-6: The script accepts only allow-listed values per axis:
  - theme ∈ `light | dark`
  - palette ∈ `default | sunset | cyberpunk | forest`
  - density ∈ `compact | normal | comfortable`
    Anything else is ignored, leaving the server-rendered default.
- AC-7: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`,
  `pnpm test`, `pnpm build` all green.

## 7. Risks

- **Hydration warning re-emergence:** lazy init means client-initial
  React state can diverge from server-render state for the hook's
  consumers. The chips inside the Popover are the only render that
  branches on the hook's value, and they only mount when the popover
  opens (post-hydration). `suppressHydrationWarning` on `<html>` /
  `<body>` covers the data-attribute case. Risk rated **low**.
- **Inline-script CSP:** if a future CSP forbids `'unsafe-inline'`
  scripts, this script breaks. Mitigation: emit a hashed CSP entry
  (`'sha256-…'`) at build time. Out of scope for this PR — no CSP is
  configured today.
- **Allow-list drift:** if the lib later adds a new palette
  (e.g. `forest-dark`), the FOUC script's allow-list must be updated
  in lockstep, otherwise the new palette won't survive reload.
  Mitigation: the spec calls this out; future palette additions
  will need the same touch already required in `DocsPreferencesMenu`.

## 8. Verification plan

1. **Lib tests** (`pnpm --filter damo-ui test`) — new lazy-init test
   plus existing 5 tests must pass.
2. **Web tests** (`pnpm --filter @damo/web test`) — vitest, no
   regressions.
3. **Typecheck + lint + format:check** — entire workspace green.
4. **Build** (`pnpm build`) — Next compiles, no `dangerouslySetInnerHTML`
   complaints, no warnings.
5. **Manual verification** (dev server):
   - Set theme=dark, locale=en. Hard reload. → dark on first frame.
   - From dark+EN, open cog → switch to IT. → reload, dark on first
     frame, no light flash.
   - Set palette=sunset, density=comfortable, theme=dark. Hard reload.
     → all three preferences active on first paint.
   - Set `localStorage.theme = "garbage"` via DevTools, reload. →
     server default (light) renders, console clean.
6. **CI** — wait green before merge per project policy.
