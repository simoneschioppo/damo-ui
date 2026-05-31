# Registry generator

Generates a [shadcn-compatible](https://ui.shadcn.com/docs/registry) registry
from `packages/ui/src`, so damo-ui can be consumed copy-paste style
(`npx damo-ui add button`) in addition to the classic npm package.

## Output

Written to `apps/web/public/r/` (the docs site doubles as the registry
endpoint, served at `https://damo-ui.com/r`):

```
r/registry.json        index of every item (name, type, title, description)
r/ui/<name>.json        one item per component + the icon set
r/lib/<name>.json       shared utilities (cn, i18n, selection-chrome, safe-href)
r/hooks/<name>.json     shared hooks
r/themes/base.json      Memphis design tokens / theme / global CSS
```

The output tree is **git-ignored** — it is regenerated on every `dev` and
`build`, never hand-edited.

## How it works

1. **Walk** `src/components/*` (each folder is one `registry:ui` item).
2. **Rewrite imports** so workspace-relative paths become the `@/`-aliased
   form a consumer expects:
   - `../../lib/cn` → `@/lib/cn`
   - `../card` → `@/components/ui/card`
   - `../../icons` → `@/components/ui/icons`
   - Same-item imports (`./button.variants`, intra-folder `../types`) are left
     relative — the folder is copied intact.
     Classification is **path-aware**: a specifier is resolved against the
     importing file's location, because the same text means different things at
     different depths (a component does `../../lib/cn`, a hook does `../lib/cn`).
3. **Classify dependencies**:
   - third-party imports → pinned npm `dependencies` (versions read from
     `packages/ui/package.json`);
   - workspace imports → `registryDependencies` (absolute URLs against
     `REGISTRY_URL`), resolved **transitively** (e.g. `date-picker` pulls
     `popover`, `i18n`, `icons`, `cn`).
4. **Emit** one JSON file per item plus the index.

`react` / `react-dom` are treated as peers and never added as dependencies.

## Run

```bash
# from packages/ui
pnpm build:registry

# point registryDependencies at a local dev server (for local CLI testing)
REGISTRY_URL=http://localhost:3000/r pnpm build:registry
```

`REGISTRY_URL` defaults to `https://damo-ui.com/r`.

## Files

| File                  | Responsibility                                               |
| --------------------- | ------------------------------------------------------------ |
| `specifiers.mjs`      | Pure import parsing / classification / rewrite (unit-tested) |
| `fsutil.mjs`          | Recursive file discovery + source filtering                  |
| `build.mjs`           | Orchestrator: transitive closure + JSON emission             |
| `specifiers.test.mjs` | Unit tests for the rewriter                                  |
