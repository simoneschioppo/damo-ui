# Build and Publish

Status: documented · Last scan: e53c5be · Sources:
`packages/ui/tsup.config.ts`,
`packages/ui/package.json`,
`packages/ui/.ladle/config.mjs`,
`packages/ui/.ladle/components.tsx`,
`packages/ui/.ladle/components.test.ts`,
`packages/ui/dist/` (current build output shape),
`.npmrc` (root).

## Summary

`@damo/ui` is built by **tsup** into a single ESM bundle plus a copied
CSS folder and a separately-bundled Tailwind v3 preset. The library is
intended for **two distribution modes**:

- **Today (transitional):** consumable as a versioned package via a
  GitHub Packages registry. The package is currently marked
  `"private": true`, so `npm publish` is blocked by default — the
  `publishConfig` block is **preparatory wiring**, not an active
  release pipeline. No published versions exist on the registry yet.
- **Target:** **shadcn/ui-style copy-paste distribution on the public
  npm registry.** Components, hooks, and the theming layer are authored
  with this future in mind: each unit should be liftable into a
  consumer's repo without pulling the whole package.

Local development uses **Ladle** (`pnpm --filter @damo/ui dev`) for
component preview and storybook-like browsing.

## Public API (what ships in `dist/`)

The `package.json` `exports` map is the contract:

| Subpath                | Resolves to                      | Kind     |
| ---------------------- | -------------------------------- | -------- |
| `.` (default)          | `dist/index.{d.ts,js}`           | TS + ESM |
| `./mocks`              | `dist/mocks/index.{d.ts,js}`     | TS + ESM |
| `./styles/tokens.css`  | `dist/styles/tokens.css`         | CSS      |
| `./styles/theme.css`   | `dist/styles/theme.css`          | CSS      |
| `./styles/globals.css` | `dist/styles/globals.css`        | CSS      |
| `./tailwind.preset`    | `dist/tailwind.preset.{d.ts,js}` | TS + ESM |

Pinning facts:

- `"type": "module"` — the whole package is ESM. There is **no CJS
  build**.
- `"files": ["dist", "README.md"]` — only `dist/` and the README are
  packaged; nothing outside `dist/` ships, including `src/`.
- `"sideEffects"` is **not** declared. Bundlers will assume side
  effects exist and may skip aggressive tree-shaking. See Open
  questions — declaring `sideEffects: ["**/*.css"]` is the typical
  shadcn-style preparation.
- **Peer dependencies:** `react >=18`, `react-dom >=18`,
  `tailwindcss >=4`, `tailwindcss-animate`. Tailwind v3 consumers are
  supported through the preset shim but `tailwindcss >=4` is the
  declared peer (see Invariants). `tailwindcss-animate` was promoted
  to peer in commit `493936b` because the lib's overlay components
  rely on its `animate-in` / `fade-in-0` / `zoom-in-95` /
  `slide-in-from-*` utilities — affects Dialog, Drawer, Popover,
  Tooltip, DropdownMenu, ContextMenu, Toast, Accordion.
- **Runtime dependencies:** Radix primitives (20+), `class-variance-authority`,
  `clsx`, `cmdk`, `date-fns`, `react-day-picker`, `tailwind-merge`.
  These are real runtime deps, not peer — every consumer of `@damo/ui`
  installs them transitively today. This is **the** key thing to revisit
  for shadcn-style distribution: copy-paste consumers should opt in to
  these deps per-component, not blanket-inherit.

## Build pipeline

The `build` script runs three phases in order:

```
tsup
  └─ entries: src/index.ts, src/mocks/index.ts
  └─ format: esm, dts, sourcemap
  └─ external: react, react-dom
  └─ treeshake: true, splitting: false, minify: false
  └─ onSuccess: prepend "use client"; to dist/index.js and dist/mocks/index.js

build:css
  └─ mkdir -p dist/styles
  └─ cp src/styles/*.css dist/styles/

build:preset
  └─ tsup tailwind.preset.ts --format esm --dts --out-dir dist --no-clean
```

Three things in this pipeline are non-obvious and load-bearing:

### "use client" prepend (tsup `onSuccess`)

After tsup writes `dist/index.js` and `dist/mocks/index.js`, the config
reads each file and **prepends `"use client";`** if it is not already
there. This is required because:

- The library exports many client-only components (Radix primitives,
  hooks with `useState`, etc.).
- Next.js App Router consumers need either `"use client"` at the consumer
  call site or at the module they import. Prepending here makes every
  consumer call site work without each one re-declaring it.
- The check (`startsWith('"use client"')`) is intentionally lenient —
  it skips re-prepending on incremental rebuilds.

### `splitting: false`

Tsup defaults to code-splitting in ESM. It is explicitly disabled here.
Reason: the library exports a flat surface from a single `src/index.ts`,
and code splitting fragments the output into chunk files that complicate
the simple `dist/index.js` resolution. With `splitting: false`, every
import path resolves to one bundled file.

### `build:preset --no-clean`

`tsup` defaults to cleaning `outDir` before writing. The preset build
step **must** pass `--no-clean` because it runs **after** the main
`tsup` build (which has `clean: true`) and after `build:css`. Without
`--no-clean`, the preset compile would wipe `dist/index.js`,
`dist/styles/`, and the mocks output. This ordering is the contract;
re-shuffling these scripts breaks the build.

### CSS handling

CSS files are **not** bundled — they are copied verbatim from
`src/styles/` to `dist/styles/` by `build:css`. This matters because:

- The values stay in plain CSS (no PostCSS, no Tailwind compilation at
  build time).
- Consumers compile Tailwind themselves, with the lib's CSS as input.
- `theme.css` uses `@theme inline` and `@utility` blocks that are
  Tailwind v4 directives — they only resolve when the consumer's
  Tailwind v4 toolchain processes them.

## Local development — Ladle

`packages/ui/.ladle/config.mjs`:

```js
{
  stories: 'src/**/*.stories.{js,jsx,ts,tsx}',
  port: 61000,
  defaultStory: 'placeholder--welcome',
  addons: { theme: { enabled: true, defaultState: 'light' } },
}
```

`packages/ui/.ladle/components.tsx` is a `GlobalProvider` that wraps
every story in a `<div data-theme={globalState.theme}>` so the Ladle
theme switcher toggles the lib's own theme attribute.

The provider currently imports three CSS files from the lib's own
sources, all of which exist on disk:

```ts
import '../src/styles/tokens.css'
import '../src/styles/theme.css'
import '../src/styles/globals.css'
```

**Historical fix (commit `337698d`).** The provider previously also
imported `../src/styles/themes.css` (typo for `theme.css`) and
`../src/styles/patterns.css` (a file that lives in `apps/web`, not the
lib — Memphis pattern decoration is intentionally consumer territory,
see `10-library/20-theming/README.md`). Both broke `pnpm --filter
@damo/ui dev` on cold start. The fix renamed the typo and dropped the
patterns import outright.

**Regression guard:** `.ladle/components.test.ts` is a static smoke
test that re-reads `.ladle/components.tsx`, extracts every relative
CSS import via regex, and asserts each one resolves to a real file on
disk. It also asserts neither dropped filename ever returns. Runs in
the lib's vitest suite, so a future broken-import edit fails CI.

## Publish status — today

The current state of the publish wiring:

| Field                                 | Value                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `package.json#name`                   | `@damo/ui`                                                                                    |
| `package.json#version`                | `0.3.0`                                                                                       |
| `package.json#private`                | `true` (publish currently disabled)                                                           |
| `package.json#publishConfig.registry` | `https://npm.pkg.github.com`                                                                  |
| `package.json#publishConfig.access`   | `restricted`                                                                                  |
| `repository.url`                      | `https://github.com/simoneschioppo/damo-ui.git`                                               |
| Root `.npmrc`                         | `auto-install-peers=true`, `prefer-workspace-packages=true`, `strict-peer-dependencies=false` |

Reading the wiring as documentation:

- `private: true` is the active source-of-truth — **no released
  versions exist on GitHub Packages today**. The version is bumped
  in-tree, but not published.
- `publishConfig` is **preparatory**: when the team flips `private` to
  `false` (or runs a release flow that strips it), the package will
  publish to `npm.pkg.github.com` under restricted access.
- The root `.npmrc` is workspace-friendly (peer auto-install, workspace
  preference) and matters at consume time, not publish time.
- No CI workflow has been audited yet for a release pipeline — see
  cross-cutting CI/CD chapter (currently `pending`) and Open questions.

## Publish target — tomorrow (shadcn-style on public npm)

The intended end state:

- **Public npm registry** instead of GitHub Packages.
- **Copy-paste distribution** instead of versioned package install.
  Consumers run a CLI (or curl a registry JSON) that fetches a single
  component's source files into their repo. The npm package, if any,
  becomes a thin metadata host (CLI + registry JSON), not the runtime
  delivery.
- **Per-component dependency declaration.** Each component file (or its
  registry entry) declares the npm packages it needs (e.g.
  `@radix-ui/react-dialog`) so `npx <cli> add dialog` runs
  `npm install @radix-ui/react-dialog` in the consumer.
- **Theming via copy of `tokens.css`/`theme.css`** (already designed for
  this — see the theming chapter).

This direction shapes near-term work the lib should not violate:

- Components must remain self-contained (no implicit cross-component
  imports beyond a few canonical helpers like `cn`).
- Hooks must remain liftable as single files.
- The runtime dep list in `package.json` must stay _honest_: any new
  Radix primitive or third-party dep added here should also be
  declarable per-component once the registry is built.
- Don't introduce build-time codegen that is hard to reproduce in a
  consumer's tree.

## Invariants & gotchas

1. **ESM only.** No CJS build. Consumers in CJS-only environments are
   not supported today.

2. **`onSuccess` "use client" prepend is mandatory.** Removing it
   forces every Next.js App Router consumer to add `"use client"`
   themselves at every import site, which defeats the lib's
   ergonomics. Keep the check (`startsWith('"use client"')`) so
   incremental builds don't double-prepend.

3. **Script order is the contract.** `tsup` (cleans) → `build:css`
   (depends on `dist/` existing) → `build:preset --no-clean` (must not
   wipe `dist/`). Reordering breaks the package.

4. **Tailwind v4 is the declared peer.** The v3 preset is a shim; do
   not advertise the lib as v3-first. `peerDependencies.tailwindcss`
   is `>=4`.

5. **CSS is shipped verbatim.** Consumers compile, the lib does not.
   Adding PostCSS to the lib's pipeline would change this contract.

6. **`sideEffects` is not declared.** This is technically permissive
   (bundlers won't aggressively drop modules), but it is also
   suboptimal for tree-shaking. Don't add `sideEffects: false` without
   first auditing every module that imports CSS — those imports must
   be listed.

7. **Version is bumped in-tree but not published.** Don't treat
   `0.3.0` as a release tag. Cross-reference the root `CHANGELOG.md`
   and `PUBLICATION_READINESS.md` for the actual readiness story.

8. **Ladle CSS imports have a static regression guard.** The
   provider's CSS imports must resolve on disk; `components.test.ts`
   enforces this. If you add a new CSS file or rename one, update
   the import AND let the test confirm it resolves rather than only
   verifying via `pnpm dev`.

## How to consume

### Today (development / linked workspace)

Inside this monorepo, `apps/web` consumes `@damo/ui` via pnpm
workspace resolution (`prefer-workspace-packages=true` in the root
`.npmrc`). No registry round-trip needed.

External consumers cannot install `@damo/ui` today — the package is
not published. The most plausible interim path is to vendor the
`packages/ui/` source into the consumer's repo manually.

### Future (shadcn-style)

The expected pattern (subject to the npm-migration plan):

```sh
npx damo-ui add button         # fetches button.tsx, button.variants.ts,
                                # index.ts into ./components/ui/button/
npx damo-ui add dialog         # also installs @radix-ui/react-dialog
npx damo-ui init               # writes tokens.css, theme.css,
                                # globals.css, and the Tailwind config bridge
```

Concrete CLI / registry shape to be defined — see Open questions.

## Open questions

1. **CI release workflow.** No release pipeline has been documented
   yet — `private: true` blocks the standard `npm publish`. If a
   workflow is added later (e.g. one that strips `private`, runs a
   changeset, and publishes to GitHub Packages), it must be
   documented in `30-cross-cutting/10-ci-cd.md` and cross-referenced
   here.

2. **`sideEffects` declaration.** Once the CSS import surface is
   stable, declare `sideEffects: ["**/*.css"]` so consumer bundlers
   can tree-shake aggressively.

3. **Per-component dependency manifest.** For shadcn-style migration,
   each component needs a declaration of its runtime npm deps. This
   could live alongside the source (`<component>.deps.json`) or in a
   central registry. Decision pending.

4. **Migration target on npm.** Package name on public npm? `@damo/ui`,
   `damo-ui`, or a new scope? Affects CLI, registry URL, install
   strings, and brand.

5. **Copy-paste contract for hooks and `lib/cn`.** Single-file
   components are easy; cross-cutting helpers (the `cn` utility, the
   two hooks) need a documented "copied alongside" rule so consumers
   don't end up with stale duplicates.

6. **Distinction between dependencies and shadcn-time installs.**
   Today every Radix primitive is a runtime `dependency` of the lib.
   Post-migration the lib package itself may have **zero** runtime
   deps and instead the registry instructs the CLI to install them
   per-component.
