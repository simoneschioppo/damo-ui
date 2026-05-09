# Publishing Model

Status: documented · Last scan: 9a573e8 · Sources:
`packages/ui/package.json`,
`PUBLICATION_READINESS.md`,
`README.md`,
`CHANGELOG.md`,
`.github/workflows/publish.yml`,
GitHub epic #77 (publication soft launch + shadcn-style migration).

## Summary

The current and target distribution models for `damo-ui`. Today the
library lives only inside this monorepo; the soft launch on public
npm runs in Phase 5 (#82). The long-term goal is a shadcn/ui-style
copy-paste flow on the same npm registry.

## Roadmap (epic #77)

The publication path is a sequence of seven phases tracked under epic
[#77](https://github.com/simoneschioppo/damo-ui/issues/77). Each phase
is a separate gating PR:

| Phase | Issue | Goal                                                                                                  | State (2026-05-09) |
| ----- | ----- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| 1     | (n/a) | Decide naming + reserve scope (`damo-ui` + `@damo-ui/*`)                                              | ✅ done            |
| 2     | #79   | Pre-publication audit: LICENSE, rename `@damo/ui` → `damo-ui`, drop GH Packages, public-consumer docs | ✅ done            |
| 3     | #80   | Clean repo via `git filter-repo` (remove bmad/kipi/output/user-data from history)                     | open               |
| 4     | #81   | Switch repo to public visibility                                                                      | open               |
| 5     | #82   | Soft launch on public npm as `damo-ui@0.4.0`                                                          | open               |
| 6.1   | #83   | Build registry generator (shadcn JSON schema)                                                         | open               |
| 6.2   | #84   | Fork shadcn CLI, rebrand as `damo-ui` CLI                                                             | open               |
| 6.3   | #85   | Set up registry endpoint + custom domain on Vercel                                                    | open               |
| 6.4   | #86   | Codemod for migrating consumers from npm-classic to copy-paste                                        | open               |
| 6.5   | #87   | (optional) MCP server `@damo-ui/mcp` for agentic workflows                                            | open               |
| 7     | #88   | Cutover: publish `damo-ui@1.0.0`, run codemod, deprecate 0.x                                          | open               |

## Today (post Phase 2)

- **Package name:** `damo-ui` (unscoped). Reserved scope: `@damo-ui/*`.
- **License:** MIT (© 2026 Simone Schioppo).
- **Distribution:** workspace-internal only. `apps/web` consumes the
  library via pnpm `workspace:*` resolution. **No published version
  exists on any registry yet.**
- **Publish wiring:** ready (`publishConfig.access: public`, no
  registry override → defaults to `registry.npmjs.org`). `private: true`
  removed in gh-79. CI workflow at `.github/workflows/publish.yml` is
  gated `if: false` until Phase 5.
- **Versioning:** `0.3.0` in tree. `0.4.0` ships in #82 (soft launch).
  `1.0.0` ships in #88 (cutover).

## Tomorrow (Phase 5: npm-classic soft launch)

The first public release. Consumers install the library exactly like
any other React component package:

```sh
pnpm add damo-ui
```

Peer deps the consumer brings: `react ≥ 18`, `react-dom ≥ 18`,
`tailwindcss ≥ 4`, `tailwindcss-animate ≥ 1.0.7`. Tailwind v3
consumers are supported through the `damo-ui/tailwind.preset` shim.

The "0.x preview" disclaimer in the root `README.md` sets expectations:
breaking changes between minor versions until `1.0.0`. Migration paths
are documented in `CHANGELOG.md`.

## After tomorrow (Phase 6: shadcn-style copy-paste)

The intended end state, Phases 6.1 → 6.5:

- **Public npm** stays the registry, but the consumer flow flips from
  `pnpm add damo-ui` to:

  ```sh
  npx damo-ui init                # writes tokens.css, theme.css, globals.css,
                                   # and the Tailwind v4 bridge
  npx damo-ui add button          # fetches button.tsx + variants + index.ts
                                   # into ./components/ui/button/
  npx damo-ui add dialog          # also installs @radix-ui/react-dialog
  ```

- **`@damo-ui/cli`** (#84) — the install/add tool. Forked from shadcn
  CLI and rebranded.
- **`@damo-ui/registry`** (#85) — the JSON registry endpoint that the
  CLI reads. Hosted on Vercel under a custom domain.
- **Per-component dependency declaration.** Each registry entry lists
  its runtime npm deps so `npx damo-ui add <name>` runs the correct
  `npm install` in the consumer.
- **Theming via copy of `tokens.css`/`theme.css`** (already designed
  for this — see `10-library/20-theming/README.md`).
- **`@damo-ui/mcp`** (#87, optional) — MCP server exposing the
  registry to agentic workflows.

## Cutover (Phase 7, #88)

`damo-ui@1.0.0` ships as a thin metadata host (CLI bootstrap +
registry pointer) rather than the runtime delivery. The npm-classic
0.x line gets deprecated; consumers run the codemod from #86 to flip
their imports from `damo-ui` package imports to copy-paste-source
imports.

## Per-component "How to consume" expectations

Each chapter under `10-library/10-components/` documents its component's
consumption pattern. The default pattern post-Phase 5 is npm-classic
import; post-Phase 7 it shifts to `npx damo-ui add <component>`. Both
should leave the consumer with a working component without surprises.

## Constraints implied by copy-paste distribution

These shape near-term work:

- **Self-contained components.** No implicit cross-component imports
  beyond a few canonical helpers (`cn`, `selectionChromeClasses`).
- **Single-file hooks.** Liftable as a single file each.
- **Honest runtime dep list.** Any new Radix primitive or third-party
  dep added to `packages/ui/package.json` must be declarable per
  component once the registry is built.
- **No build-time codegen** that is hard to reproduce in a consumer's
  tree.
- **Zero global state.** Components rely only on CSS variables and
  data-attributes on `<html>`; no module-scope singletons.

See `10-library/30-build-and-publish/README.md` for the build pipeline
detail and the `package.json` invariants.
