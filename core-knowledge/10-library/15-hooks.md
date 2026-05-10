# Hooks

Status: documented · Last scan: f9d7d14 · Sources:
`packages/ui/src/hooks/{use-resolved-css-vars.ts,use-persisted-attr.ts}` +
`packages/ui/src/lib/i18n/provider.tsx` (re-exports `useI18n`, `useLocale`).

## Hook inventory

| Hook                 | Source                           | Notes                                                   |
| -------------------- | -------------------------------- | ------------------------------------------------------- |
| `useResolvedCssVars` | `hooks/use-resolved-css-vars.ts` | Reads computed CSS variable values at runtime           |
| `usePersistedAttr`   | `hooks/use-persisted-attr.ts`    | Two-way bind a `data-*` attr on `<html>` ↔ localStorage |
| `useI18n`            | `lib/i18n/provider.tsx`          | Returns the active dictionary; falls back to EN         |
| `useLocale`          | `lib/i18n/provider.tsx`          | Returns the active locale (`'en' \| 'it'`)              |

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
`document.documentElement[attribute]`.

**Lazy init (no-flash invariant).** `useState` is initialised with a
factory that synchronously reads `localStorage[storageKey]` on the
client and returns it as the initial value (falling back to
`defaultValue` if the key is empty or storage throws — Safari
private mode, blocked storage). On the server (`typeof window ===
'undefined'`) the factory returns `defaultValue` so SSR markup is
unchanged. Without lazy init, the first commit would render with
`defaultValue`, and the post-paint DOM-write effect would clobber any
attribute previously written by a host-side FOUC script — producing
a one-frame flash before the storage value caught up. Hard rule for
maintainers: don't replace the lazy initializer with `useState(defaultValue)`
without also rethinking the FOUC story end-to-end.

Argument validation: `attribute` must match `/^data-[a-z][a-z0-9-]*$/`
and `storageKey` must match `/^[a-zA-Z0-9_:.-]{1,128}$/`. Both throw
synchronously if violated — defensive against accidentally turning
an attribute write into an event-handler binding or colliding with
prototype-probe storage keys (`__proto__`, `constructor`).

This hook is not value-validating: it returns whatever string was
persisted. Per-axis allow-list sanitisation lives in the consumer
(see `apps/web/app/_components/DocsPreferencesMenu.tsx`'s post-mount
effects, which reset to a known good default if the persisted value
is no longer in the option set — e.g. after a palette rename). Pair
that with a host-side FOUC script (see
[`20-web-app/00-architecture.md`](../20-web-app/00-architecture.md))
when the host needs zero-flash UX on cold reload.

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
