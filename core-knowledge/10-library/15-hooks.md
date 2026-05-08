# Hooks

Status: documented · Last scan: 27c8471 · Sources:
`packages/ui/src/hooks/{use-resolved-css-vars.ts,use-persisted-attr.ts}` +
`packages/ui/src/lib/i18n/provider.tsx` (re-exports `useI18n`, `useLocale`).

## Hook inventory

| Hook                  | Source                              | Notes                                                |
|-----------------------|-------------------------------------|------------------------------------------------------|
| `useResolvedCssVars`  | `hooks/use-resolved-css-vars.ts`    | Reads computed CSS variable values at runtime        |
| `usePersistedAttr`    | `hooks/use-persisted-attr.ts`       | Two-way bind a `data-*` attr on `<html>` ↔ localStorage |
| `useI18n`             | `lib/i18n/provider.tsx`             | Returns the active dictionary; falls back to EN     |
| `useLocale`           | `lib/i18n/provider.tsx`             | Returns the active locale (`'en' \| 'it'`)          |

All hooks run on the client only — they read from `window` /
`document` directly (or via `useState`/`useContext`) and are safe to
call from `'use client'` components.

## Per-hook contract

### `useResolvedCssVars`

Reads computed CSS variable values from the document root, returning
a record keyed by the variable names you pass in. Re-runs when
the active theme/palette/density data attribute changes.

Inputs: `vars: ReadonlyArray<string>` (variable names without `var()`).
Output: `Record<string, string>`.
Side effects: registers a `MutationObserver` on `<html>`'s
`data-theme` / `data-palette` / `data-density` attributes.

### `usePersistedAttr`

Bidirectional binding between a `data-*` attribute on the document
root and a `localStorage` key. Used by the docs site for theme,
palette, and density (and indirectly for locale via the wrapper in
`apps/web/lib/usePersistedLocale.ts`).

Signature:

```ts
function usePersistedAttr<T extends string>(
  storageKey: string,
  attribute: string,
  defaultValue: T,
): readonly [T, (next: T) => void]
```

Side effects: writes `localStorage`, mutates
`document.documentElement[attribute]`. Sanitises stale storage
values back to `defaultValue` on mount.

### `useI18n` and `useLocale`

Read from the `<I18nProvider>` context. Without a provider, they
fall back to the EN dictionary and `'en'` respectively. See
[16-i18n.md](16-i18n.md) for the full provider contract,
fallback semantics, and the per-component dictionary-path map.

## Composition patterns

- **`usePersistedAttr` + `<html data-*>`** is how the docs site
  drives theme / palette / density without a React store. The hook
  is intentionally one-axis-per-mount; mounting it three times in
  `DocsPreferencesMenu` keeps each axis independent.
- **`usePersistedLocale` (apps/web)** wraps `usePersistedAttr` on
  `data-locale`, plus extra surfaces (`<html lang>`, the
  `NEXT_LOCALE` cookie). It is documented in
  [`20-web-app/00-architecture.md`](../20-web-app/00-architecture.md).
- **`useI18n` is consumed by 8 lib components**; see the table in
  [16-i18n.md](16-i18n.md).

## Testing conventions for hooks

Smoke tests live alongside their source for hooks-with-utilities
(e.g. `cn.test.ts`). Provider hooks are tested through the provider
file's test suite (`provider.test.tsx`). Component-level i18n smoke
tests cover the consuming side (provider mounted vs bare; EN / IT;
caller-prop-wins).

## Copy-paste portability checklist

For a shadcn-style copy of any single hook:

- `useResolvedCssVars` and `usePersistedAttr` are zero-dep — copy
  the file as-is.
- `useI18n` and `useLocale` require the surrounding `lib/i18n/`
  folder (provider + dictionaries + types). Either lift the whole
  folder, or replace the hook bodies with a constant returning the
  consumer's own dictionary shape.
