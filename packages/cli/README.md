# damo-ui

The CLI for [damo-ui](https://github.com/simoneschioppo/damo-ui) — add
Memphis-flavoured components to your project **shadcn-style**: the source is
copied into your codebase (not imported from a black-box package), so you own
and can tweak every line.

> Published as `damo-ui` during the 0.x line; at the 1.0 cutover it takes
> the bare `damo-ui` name (so `npx damo-ui add …`). The `bin` is already
> `damo-ui`.

## Usage

```bash
# 1. scaffold components.json
npx damo-ui init

# 2. add components (pulls their cn/icons/i18n deps + installs npm packages)
npx damo-ui add button dialog

# add directly from a URL
npx damo-ui add https://damo-ui.com/r/ui/button.json

# 3. browse what's available
npx damo-ui list
```

## Commands

| Command                    | What it does                                                        |
| -------------------------- | ------------------------------------------------------------------- |
| `init`                     | Write `components.json` (detects `src/` layout + your globals.css). |
| `add <component...>`       | Copy components + their transitive registry deps; install npm deps. |
| `list`                     | List everything in the registry, grouped by kind.                   |
| `codemod migrate-from-npm` | Move a project off the classic `damo-ui` package to copy-paste.     |

## Options

| Flag                   | Default                 | Notes                                             |
| ---------------------- | ----------------------- | ------------------------------------------------- |
| `-r, --registry <url>` | `https://damo-ui.com/r` | Registry base URL.                                |
| `--cwd <dir>`          | `.`                     | Target project directory.                         |
| `--overwrite`          | off                     | Overwrite files that already exist.               |
| `--no-deps`            | —                       | Skip installing npm dependencies.                 |
| `--dry-run`            | off                     | Show planned changes without writing (`codemod`). |
| `-f, --force`          | off                     | Overwrite an existing `components.json` (`init`). |
| `-y, --yes`            | off                     | Assume defaults / skip prompts.                   |

The registry URL can also be set with the `DAMO_UI_REGISTRY` env var.

## Migrating from the `damo-ui` npm package

Already using `import { Button } from 'damo-ui'`? One command converts the
whole project to copy-paste:

```bash
npx damo-ui codemod migrate-from-npm --dry-run   # preview
npx damo-ui codemod migrate-from-npm             # apply
```

It scans every `from 'damo-ui'` import/re-export (named, type-only, aliased,
mixed), copies each used component via `add`, rewrites the imports to
`@/components/ui/<name>` (or a relative path when no `@/` alias is set), and
removes `damo-ui` from `package.json`. The pass is **idempotent** and
TypeScript-aware (ts-morph). Review the diff and run your formatter afterwards.

## How it works

`add` fetches the registry item JSON, follows `registryDependencies`
transitively (so `dialog` pulls `cn`, `icons`, `i18n`…), rewrites nothing
(the registry already ships `@/`-aliased imports), writes each file to the
path implied by your `components.json` aliases, then installs the union of npm
`dependencies` with your detected package manager.

The `init` / `add` / `list` commands have no runtime dependencies (Node ≥ 18,
built-in `fetch`). The `codemod` command additionally uses `ts-morph` for the
TypeScript-aware AST rewrite (lazy-loaded, so it costs nothing for the other
commands).

## Attribution

A focused, dependency-free reimplementation of the
[shadcn](https://ui.shadcn.com) CLI workflow, compatible with the
`components.json` schema. See [`NOTICE`](./NOTICE).
