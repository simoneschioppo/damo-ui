# Library Architecture

Status: documented · Last scan: 27c8471 · Sources:
`packages/ui/src/{index.ts,components/,hooks/,icons/,lib/,styles/,mocks/}`.

## Summary

`@damo/ui` is a TypeScript React component library distributed
through GitHub Packages today, targeting an eventual shadcn-style
copy-paste npm distribution. The source tree groups files by
responsibility: components are organized one folder per component
under `components/`; cross-cutting hooks, icons, utility helpers,
and the shared i18n primitive live as sibling modules.

## Source tree map

```
packages/ui/src/
├── index.ts              # public entry — re-exports every public API
├── components/           # one folder per component
│   ├── <name>/
│   │   ├── <name>.tsx
│   │   ├── <name>.variants.ts   # cva variant tables (where used)
│   │   ├── <name>.test.tsx
│   │   ├── <name>.stories.tsx   # Ladle stories
│   │   └── index.ts             # barrel
│   └── …
├── hooks/                # cross-cutting client hooks
│   ├── use-resolved-css-vars.ts
│   └── use-persisted-attr.ts
├── icons/                # SVG icon components
├── lib/
│   ├── cn.ts             # tailwind-merge + clsx wrapper
│   └── i18n/             # locale-aware default labels (EN / IT)
│       ├── types.ts
│       ├── provider.tsx
│       ├── dictionaries/{en,it,index}.ts
│       └── __tests__/provider.test.tsx
├── styles/               # tokens.css, theme.css, globals.css (CSS-only)
└── mocks/                # showcase scenes for theme generator
```

## Public entry point and exports surface

`src/index.ts` is the only file consumers import from. It is split
into commented sections by component family and tier (foundations,
tier-1 core, form inputs, feedback, navigation, data display,
layout, hooks). The barrel re-exports:

- **All component implementations and their variant types.**
- **Hooks**: `useResolvedCssVars`, `usePersistedAttr`.
- **i18n primitive**: `I18nProvider`, `useI18n`, `useLocale`,
  `dictionaries`, `DEFAULT_LOCALE`, `Locale`, `Dictionary`,
  `I18nProviderProps`. See [16-i18n.md](16-i18n.md).
- **`cn`** utility from `lib/cn.ts`.
- **Icons** via `export * from './icons'`.
- **`__version`** constant.

The `mocks/` directory ships as a separate sub-export
(`@damo/ui/mocks`) for the theme generator's scene previews.

## Internal vs. public modules

- **Internal**: anything **not** re-exported by `src/index.ts`.
  Specifically: variant tables (`*.variants.ts`), individual icon
  files, internal i18n dictionaries (consumers import `dictionaries`
  the bundle, not single-locale files), per-component test/story
  helpers.
- **Public**: every name in `src/index.ts`.

The build (tsup) emits `dist/index.js` and `dist/index.d.ts` from
the barrel; nothing else is reachable from a published package.

## Cross-module dependencies and rules

1. **No circular imports.** Components import from `lib/`, `hooks/`,
   `icons/`. The reverse is forbidden.
2. **`lib/i18n/` is leaf-only.** It depends on React + date-fns
   (for the `dateFnsLocale` typed import) and nothing else in the
   lib.
3. **No global state.** The i18n provider is the only contextual
   state in the library. Theme/palette/density state lives on
   `<html data-*>` and is read via `usePersistedAttr` — also
   non-global.
4. **No side-effectful imports.** Importing any module from the lib
   must not register listeners, mutate `document`, or read from
   storage at module-eval time. (Provider effects run only after
   mount.)

## Key invariants

- **Immutability everywhere.** No `mutate`, `splice`, or in-place
  reassignment in lib code. Variant tables, dictionaries, and props
  are passed as `Readonly` / `ReadonlyArray` where the type system
  can express it.
- **Caller props always win over internal defaults.** This includes
  the i18n dictionary lookup — every consuming component (`Spinner`,
  `Combobox`, `DatePicker`, `Pagination`, `Banner`, `Dialog`,
  `Drawer`, `Toast`) reads the dictionary entry only when the
  caller did not pass an explicit prop.
- **EN-first defaults.** Bare components rendered without
  `<I18nProvider>` resolve to English. Italian is accessed by
  mounting the provider with `locale="it"`.
- **No global CSS reset.** Components style themselves; consumers
  bring their own resets (`globals.css` is opt-in).
- **Tailwind v4 compatible.** Components consume tokens via CSS
  variables, never via hard-coded hex / rgb values.

## Open questions

1. **Public mocks exports.** The `mocks/` sub-export is currently
   used only by the docs site. If we publish to npm, document
   whether mocks ship to consumers or stay private to the monorepo.
2. **i18n dictionary registry.** No public `addLocale()` helper —
   third locales must come through the `dictionary` prop on
   `<I18nProvider>` per-mount. Track in [16-i18n.md](16-i18n.md).
