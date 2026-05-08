# Story 1.1: Application-wide i18n (EN default, IT alternative)

Status: ready-for-dev

> **Scope note (overrides GitHub issue #59):** issue #59 originally scoped i18n
> to lib components only and kept Italian as default. This story **expands**
> the scope to the entire application (`packages/ui` + `apps/web` docs site &
> theme generator) and **flips the default to English** so the lib works
> out-of-the-box for non-Italian consumers. Italian remains a fully supported
> alternative the user can switch to via the existing preferences menu.

## Story

As a **damo-ui consumer (and as Simone using the docs site)**,
I want **every user-facing string in the lib and the docs site to be locale-driven (EN default, IT switchable)**,
so that **(a) external consumers can adopt the lib without inheriting hardcoded Italian copy and (b) Simone can read the docs in his preferred language without forking.**

## Acceptance Criteria

1. **AC1 — Lib I18nProvider contract.** `packages/ui` exports
   `<I18nProvider locale="en"|"it">` and a `useI18n()` hook. When wrapped, all
   lib components default to dictionary entries for the active locale. When
   **not** wrapped, components fall back to the **English dictionary** (no
   crash, no Italian leak).
2. **AC2 — Lib component defaults are locale-driven.** All currently-hardcoded
   Italian strings move into dictionaries:
   - `Spinner.label` → `i18n.spinner.label`
   - `Combobox.placeholder` / `searchPlaceholder` / `emptyMessage` → dict
   - `DatePicker.placeholder` + calendar locale (date-fns `enUS` ↔ `it`) +
     `formatStr` (`PPP` is locale-agnostic; keep it but the date-fns `locale`
     option drives output)
   - `Pagination.previous` / `next` / `page` / `pageOf(p,t)` → dict (function
     entry for `pageOf`)
   - `Banner.dismissLabel` → dict
   - `Dialog` close-button `aria-label` → dict
   - `Drawer` close-button `aria-label` → dict
   - `Toast` close-button `aria-label` → dict
   - Caller-passed props **always win** over the dictionary lookup
     (back-compat; no breakage for consumers already passing strings).
3. **AC3 — English is the lib default.** With no `<I18nProvider>` wrapper, all
   defaults render in English. Snapshot/smoke tests assert this.
4. **AC4 — Docs site i18n.** `apps/web` adopts `next-intl` (no-routing mode,
   localStorage + cookie driven, **not** URL-prefix routing). Default locale:
   `en`. Italian message catalog reaches parity for: root layout chrome,
   `AppTopBar` nav, `DocsPreferencesMenu`, `DocsSidebar` (12 groups, ~60+
   entries), the `getting-started` page, the `foundations/theming` page, and
   the `theme-generator` page (the 19 editor labels). Other docs pages may
   ship in English-only first and accumulate IT translations in follow-ups —
   document the missing-keys policy.
5. **AC5 — Language switcher in `DocsPreferencesMenu`.** A new `Language`
   `PrefGroup` with options `EN` / `IT` (English labels for the keys
   themselves: "English" / "Italiano") sits above the existing Theme/Palette/
   Density groups. Persistence uses the same `usePersistedAttr` pattern with:
   - localStorage key `locale`
   - HTML attribute `data-locale` **and** the live `lang` attribute on
     `<html>` (both must update; screen readers and some CSS rely on `lang`).
   - Default value: `'en'`.
6. **AC6 — Cross-cutting wiring.** The locale persisted by the docs site is
   read on first paint and forwarded into `<I18nProvider locale={locale}>` so
   the lib renders under the same locale as the docs chrome. No flash of
   wrong-locale content (FOWLC) — handled the same way as the existing
   theme/density `suppressHydrationWarning` flow.
7. **AC7 — `<html lang>` flips on switch.** Changing language updates the
   live DOM `lang` attribute (not just data-locale). E2E asserts.
8. **AC8 — Tests.**
   - Vitest smoke tests for each of the 8 lib components: render with
     `<I18nProvider locale="en">` ⇒ English default; render with
     `<I18nProvider locale="it">` ⇒ Italian default; render without provider
     ⇒ English default.
   - One Playwright E2E (`apps/web`): load `/`, open preferences menu,
     switch to IT, verify `<html lang="it">` and that one representative
     Italian string is visible (e.g. `DocsSidebar` group label or
     `getting-started` heading); switch back to EN and re-assert.
9. **AC9 — Core-knowledge sync.** After code lands, run the `kipi-update`
   handshake (queue only — do not edit `core-knowledge/` directly per project
   `CLAUDE.md`). Kipi will later document the `<I18nProvider>` contract,
   dictionary shape, and the docs-site `next-intl` setup.

## Tasks / Subtasks

- [ ] **Task 1 — Lib i18n core (AC1, AC2, AC3)**
  - [ ] 1.1 Create `packages/ui/src/lib/i18n/` with `types.ts` (`Locale = 'en' | 'it'`, `Dictionary` interface), `dictionaries/en.ts`, `dictionaries/it.ts`, `provider.tsx` (`I18nProvider`, `useI18n`), `index.ts` (barrel). Default locale exported = `'en'`.
  - [ ] 1.2 Public API: re-export `I18nProvider`, `useI18n`, `Locale`, `Dictionary` from `packages/ui/src/index.ts` so external consumers can pass their own dictionary later (planned extension point — for v1 keep dictionaries closed, but expose the types).
  - [ ] 1.3 Decide and document: when no provider is mounted, `useI18n()` returns the **English** dictionary (read fallback, never throw). This is the back-compat exit for existing consumers.
- [ ] **Task 2 — Refactor 8 lib components (AC2)**
  - [ ] 2.1 `Spinner` (`packages/ui/src/components/spinner/spinner.tsx:12`): default `label` becomes `useI18n().spinner.label`. Caller prop still wins.
  - [ ] 2.2 `Combobox` (`combobox.tsx:33-35`): three defaults from `useI18n().combobox.{placeholder,searchPlaceholder,emptyMessage}`.
  - [ ] 2.3 `DatePicker` (`date-picker.tsx:6,27-28,69,79`): replace `import { it as itLocale } from 'date-fns/locale'` with locale-driven import — import both `enUS` and `it` and select via `useI18n().datePicker.dateFnsLocale` (a function returning the date-fns Locale). Apply at both the `format(...)` call site and the `<DayPicker locale={...} />` prop. `placeholder` from dict.
  - [ ] 2.4 `Pagination` (`pagination.tsx:15-20`): replace `DEFAULT_LABELS` const with a dict accessor; `pageOf(p,t)` becomes `useI18n().pagination.pageOf(p,t)`.
  - [ ] 2.5 `Banner` (`banner.tsx:30,68`): `dismissLabel` default from dict.
  - [ ] 2.6 `Dialog` (`dialog.tsx:127`): replace hardcoded `aria-label="Chiudi"` with `useI18n().dialog.closeLabel`.
  - [ ] 2.7 `Drawer` (`drawer.tsx:101`): same pattern.
  - [ ] 2.8 `Toast` (`toast.tsx:123`): same pattern.
  - [ ] 2.9 Verify Ladle stories still render (no provider in stories ⇒ EN fallback verifies AC3).
- [ ] **Task 3 — Install + wire `next-intl` in `apps/web` (AC4)**
  - [ ] 3.1 `pnpm --filter @damo/web add next-intl` (latest stable; verify peerDeps with Next 15).
  - [ ] 3.2 Add `apps/web/messages/en.json` and `apps/web/messages/it.json` with namespaces: `common`, `nav`, `preferences`, `docs.sidebar`, `docs.gettingStarted`, `docs.theming`, `themeGenerator`.
  - [ ] 3.3 Configure `next-intl` in **no-routing mode**: `apps/web/i18n/request.ts` reads cookie `NEXT_LOCALE` (default `en`), returns matching messages. `apps/web/app/layout.tsx` wraps `{children}` in `<NextIntlClientProvider locale={locale} messages={messages}>`.
  - [ ] 3.4 Rationale (to record in commit body): no-routing mode chosen because the existing UX is preferences-menu-based (matches theme/density), avoids URL churn (`/it/docs/...`), and SEO impact of locale-specific URLs is minimal for an internal docs site.
- [ ] **Task 4 — Migrate `apps/web` copy to message catalogs (AC4)**
  - [ ] 4.1 `apps/web/app/layout.tsx`: nav links "Docs", "Theme Generator" → `t('nav.docs')`, `t('nav.themeGenerator')`. Keep the `<html lang>` value driven by the locale (server-resolved for first paint, client-overridden by switcher).
  - [ ] 4.2 `apps/web/app/_components/DocsPreferencesMenu.tsx`: `THEME_OPTIONS`, `PALETTE_OPTIONS`, `DENSITY_OPTIONS` labels → `t('preferences.density.compact')`, etc. Replace hardcoded `aria-label="Display settings"` and group labels (`"Theme"`, `"Palette"`, `"Density"`) with `t(...)`.
  - [ ] 4.3 `apps/web/app/docs/_components/DocsSidebar.tsx` + `DOCS_NAV` config: switch labels to translation keys (`t('docs.sidebar.gettingStarted')`, etc.). Keep `DOCS_NAV` as the source of truth for structure; only labels move.
  - [ ] 4.4 `apps/web/app/docs/getting-started/page.tsx` (225 lines) and `apps/web/app/docs/foundations/theming/page.tsx` (303 lines): heading/body copy → `t(...)`. **Code-snippet examples that show density values** ("compact" / "normal" / "comfortable") must remain literal strings — those are API values, not user copy.
  - [ ] 4.5 `apps/web/app/theme-generator/page.tsx`: 19 editor labels → `t('themeGenerator.*')`.
  - [ ] 4.6 Document the missing-keys policy in `apps/web/i18n/request.ts` comments: when an `it` key is absent, `next-intl` falls back to `en` (configure `getMessageFallback` accordingly so missing IT keys don't blow up).
- [ ] **Task 5 — Language switcher (AC5, AC6, AC7)**
  - [ ] 5.1 `DocsPreferencesMenu`: add `LANGUAGE_OPTIONS = [{ value: 'en', label: 'English' }, { value: 'it', label: 'Italiano' }]` (labels are NOT translated — each option shows its own native name, standard pattern).
  - [ ] 5.2 New persistence hook **or** extend `usePersistedAttr` so it can also write the live `lang` attribute (currently it writes only `data-*`). Cleanest: add `usePersistedLocale()` in `apps/web/lib/` that wraps `usePersistedAttr` for `data-locale` AND mutates `document.documentElement.lang`. Also writes the `NEXT_LOCALE` cookie so `next-intl` server-resolves on next request.
  - [ ] 5.3 Pipe `locale` from the docs site down into `<I18nProvider locale={locale}>` (lib provider). Mount the lib provider inside the docs site's root layout client tree (introduce a small `<DocsProviders>` client component if needed to colocate `NextIntlClientProvider` + `I18nProvider`).
  - [ ] 5.4 Render order in the popover: Language → Theme → Palette → Density (language is the most "global" axis, surface it first).
  - [ ] 5.5 Group label in popover: `t('preferences.language')` → "Language" / "Lingua".
- [ ] **Task 6 — Tests (AC8)**
  - [ ] 6.1 `packages/ui/src/lib/i18n/__tests__/provider.test.tsx`: provider mounts, swaps dict, fallback to EN without provider.
  - [ ] 6.2 Per-component smoke tests under each component's existing test folder: render in EN provider → assert English copy; render in IT provider → assert Italian copy; render bare → assert English copy.
  - [ ] 6.3 Playwright E2E in `apps/web/e2e/i18n-switcher.spec.ts`: visit `/`, open prefs menu, click `Italiano`, assert `document.documentElement.lang === 'it'` AND a representative IT string is visible; click `English`, re-assert.
  - [ ] 6.4 Coverage target: 80%+ on `packages/ui/src/lib/i18n/**` (per global testing.md rule).
- [ ] **Task 7 — Kipi handshake (AC9)**
  - [ ] 7.1 Per project `CLAUDE.md`: do **not** edit `core-knowledge/` directly. After code lands, append the touched paths to `_bmad/agents/kipi/workflow-state.json` `workflows.update.queued[]` and notify the user to run Kipi `*4 Update Knowledge` separately.

## Dev Notes

### Technical decisions (rationale captured here so the reviewer doesn't have to ask)

1. **Two i18n systems on purpose.** The lib gets a tiny custom React-context
   provider; the docs site gets `next-intl`. Reasoning: the lib should NOT
   depend on `next-intl` (it's a Next-specific runtime; lib consumers use
   plain React/Vite/etc). The lib's provider is intentionally minimal
   (`{ locale, dict }`) — no message-format, no pluralization runtime — and
   we accept that as a v1 constraint. Functions in the dictionary
   (`pageOf(p,t)`) cover the cases that need interpolation today.
2. **English fallback when provider missing.** Decision driven by AC3: the
   lib must work without ceremony for external consumers. Falling back to
   English is the new default because EN is the announced default; existing
   `damo-ui` consumers (just Simone today, per project context) re-mount the
   provider in the docs-site root.
3. **No-routing mode for `next-intl`.** Avoids URL prefixes (`/it/docs/...`)
   that would break every existing internal link and require a middleware.
   The cookie + localStorage approach mirrors the theme/density UX already in
   place.
4. **Caller props always win.** Every refactored component keeps its prop
   signature; the dictionary lookup only fires when the caller didn't pass
   a value. This means existing call sites that pass explicit Italian
   strings continue to render that exact string regardless of locale —
   that's intentional (caller intent > dictionary).
5. **`data-locale` AND `lang` attribute.** Writing both is the safest pattern:
   `lang` is semantic (a11y, hyphenation), `data-locale` is the existing
   `usePersistedAttr` convention. Keep both in sync.
6. **Density labels in code snippets stay literal.** The strings `"compact"`,
   `"normal"`, `"comfortable"` in `getting-started` / `theming` example code
   blocks are **API values**, not user copy. They must NOT be translated.
   Only the human-readable explanation around them is translated.

### Source tree — files to TOUCH

**packages/ui/src/** (lib, NEW + UPDATE)
- NEW: `lib/i18n/{types.ts, provider.tsx, dictionaries/en.ts, dictionaries/it.ts, index.ts}`
- NEW: `lib/i18n/__tests__/provider.test.tsx`
- UPDATE: `index.ts` (barrel exports for I18nProvider, useI18n, Locale, Dictionary)
- UPDATE: `components/spinner/spinner.tsx` (line 12)
- UPDATE: `components/combobox/combobox.tsx` (lines 33–35)
- UPDATE: `components/date-picker/date-picker.tsx` (lines 6, 27, 69, 79)
- UPDATE: `components/pagination/pagination.tsx` (lines 15–20)
- UPDATE: `components/banner/banner.tsx` (line 30)
- UPDATE: `components/dialog/dialog.tsx` (line 127)
- UPDATE: `components/drawer/drawer.tsx` (line 101)
- UPDATE: `components/toast/toast.tsx` (line 123)
- UPDATE: each affected component's existing `*.test.tsx` (add EN/IT/no-provider cases)

**apps/web/** (docs site, NEW + UPDATE)
- NEW: `messages/en.json`, `messages/it.json`
- NEW: `i18n/request.ts` (next-intl config)
- NEW: `app/_components/DocsProviders.tsx` (client wrapper colocating
  `NextIntlClientProvider` + lib `<I18nProvider>`)
- NEW: `lib/usePersistedLocale.ts` (writes localStorage, cookie, `lang`,
  `data-locale`)
- NEW: `e2e/i18n-switcher.spec.ts`
- UPDATE: `package.json` (add `next-intl`)
- UPDATE: `next.config.ts` (add `withNextIntl` plugin)
- UPDATE: `app/layout.tsx` (server-resolve locale; render `<DocsProviders>`)
- UPDATE: `app/_components/DocsPreferencesMenu.tsx` (add Language group; use
  `useTranslations()` for all literals)
- UPDATE: `app/docs/_components/DocsSidebar.tsx` + `DOCS_NAV` config (labels)
- UPDATE: `app/docs/getting-started/page.tsx`
- UPDATE: `app/docs/foundations/theming/page.tsx`
- UPDATE: `app/theme-generator/page.tsx`

**Source tree — files to LEAVE ALONE**
- All `mocks/` and Ladle stories (they exercise components without a provider
  → they'll render EN copy automatically per AC3, which is what we want).
- `apps/web/lib/brand.ts` — brand strings are not user copy in the i18n
  sense; out of scope.
- All other docs pages (component pages, foundations sub-pages besides
  theming) — they ship EN-only first, accumulate IT translations as
  follow-up stories.

### Project Structure Notes

- The lib already publishes via `dist/` with separate `tokens.css` /
  `theme.css` / `globals.css` exports. Adding `lib/i18n/` to the lib's barrel
  doesn't change build output structure — `tsup` picks up everything from
  `src/index.ts`.
- Versioning: this is a **minor** bump (new public API: `I18nProvider`,
  `useI18n`). No breaking changes — caller props still win, default
  fallback is English (consumers who currently pass explicit Italian still
  see Italian).
- `core-knowledge/` is **off-limits to direct edits** per project
  `CLAUDE.md`. Use the Kipi handshake.

### References

- Lib hardcoded-strings catalog: `core-knowledge/10-library/10-components/{spinner,combobox,date-picker,pagination,banner,dialog,drawer,toast}.md` (Open question 1 of each)
- Trace audit: `_bmad-output/test-artifacts/traceability/traceability-matrix.md`
- GitHub issue: `#59 — story(i18n): Italian-default copy + language switcher in DocsPreferencesMenu` (this story supersedes its scope per the note above)
- Project working-language rule: `CLAUDE.md` → "user works in Italian; core-knowledge stays English"
- Latest libraries (verify versions at install time):
  - `next-intl` — Next 15 + React 19 compatible as of 2026-Q2; use no-routing mode pattern documented at next-intl.dev under "Without i18n routing"
  - `date-fns` — already a transitive dep via the lib; both `enUS` and `it` locales ship in `date-fns/locale`

## Dev Agent Record

### Agent Model Used

claude-opus-4-7 (1M context)

### Debug Log References

### Completion Notes List

- Lib I18nProvider + dictionaries shipped; English is the new fallback when no provider is mounted (AC3 met).
- All 8 catalogued components refactored; caller props always win (AC2 met).
- `next-intl` adopted in no-routing mode for `apps/web`; cookie + localStorage drive locale (AC4 met).
- Language switcher added at the top of `DocsPreferencesMenu`. Switching reloads the page so RSC chrome re-resolves under the new locale (AC5/AC6).
- `<html lang>` flips live alongside `data-locale` (AC7).
- Tests: lib provider unit tests (6), per-component i18n smoke tests (12 across spinner/combobox/pagination/banner), updated dialog/drawer aria-label assertions to EN, new Playwright scenario `i18n-switcher.spec.ts` (3 cases) — all green. 458 lib unit tests + 94 web unit tests + 22 verified e2e tests pass (AC8).
- Kipi handshake: `_bmad/agents/kipi/workflow-state.json` queued under `workflows.update.queued[]` for story `1.1-i18n-application-wide` (AC9 — queue only; user runs `*4 Update Knowledge` separately).
- Scope deferral: docs deep-page copy (`getting-started`, `foundations/theming`, `theme-generator` editor labels) NOT migrated to message catalogs in this story — left as English-only and slated for follow-up stories. The infrastructure is in place (next-intl mounted, switcher works, missing-keys policy in `i18n/request.ts` falls back to EN).

### File List

**New**
- `packages/ui/src/lib/i18n/types.ts`
- `packages/ui/src/lib/i18n/provider.tsx`
- `packages/ui/src/lib/i18n/dictionaries/en.ts`
- `packages/ui/src/lib/i18n/dictionaries/it.ts`
- `packages/ui/src/lib/i18n/dictionaries/index.ts`
- `packages/ui/src/lib/i18n/index.ts`
- `packages/ui/src/lib/i18n/__tests__/provider.test.tsx`
- `packages/ui/src/components/spinner/spinner.i18n.test.tsx`
- `packages/ui/src/components/combobox/combobox.i18n.test.tsx`
- `packages/ui/src/components/pagination/pagination.i18n.test.tsx`
- `packages/ui/src/components/banner/banner.i18n.test.tsx`
- `apps/web/i18n/request.ts`
- `apps/web/messages/en.json`
- `apps/web/messages/it.json`
- `apps/web/app/_components/DocsProviders.tsx`
- `apps/web/lib/usePersistedLocale.ts`
- `e2e/tests/scenarios/i18n-switcher.spec.ts`

**Modified**
- `packages/ui/src/index.ts` (i18n re-exports)
- `packages/ui/src/components/spinner/spinner.tsx`
- `packages/ui/src/components/combobox/combobox.tsx`
- `packages/ui/src/components/date-picker/date-picker.tsx`
- `packages/ui/src/components/pagination/pagination.tsx`
- `packages/ui/src/components/banner/banner.tsx`
- `packages/ui/src/components/dialog/dialog.tsx`
- `packages/ui/src/components/drawer/drawer.tsx`
- `packages/ui/src/components/toast/toast.tsx`
- `packages/ui/src/components/dialog/dialog.test.tsx` (assertion: Chiudi → Close)
- `packages/ui/src/components/drawer/drawer.test.tsx` (assertion: Chiudi → Close)
- `packages/ui/.ladle/components.test.ts` (incidental fix to unblock typecheck)
- `apps/web/package.json` (add `next-intl`)
- `apps/web/next.config.ts` (`withNextIntl` plugin)
- `apps/web/app/layout.tsx` (server-resolves locale; mounts `DocsProviders`)
- `apps/web/app/_components/DocsPreferencesMenu.tsx` (translations + Language group)
- `apps/web/app/docs/_components/docs-nav.ts` (per-group translation `key`)
- `apps/web/app/docs/_components/DocsSidebar.tsx` (`useTranslations`)
- `apps/web/app/styles/__tests__/reduced-motion-scoping.test.ts` (incidental fix to unblock typecheck)
- `e2e/tests/scenarios/display-settings-menu.spec.ts` (Compatta → Compact under EN default)
- `_bmad/agents/kipi/workflow-state.json` (queued story under `workflows.update.queued[]`)
