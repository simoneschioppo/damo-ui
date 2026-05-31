# @damo-ui/cli

The CLI for [damo-ui](https://github.com/simoneschioppo/damo-ui) — add
Memphis-flavoured components to your project **shadcn-style**: the source is
copied into your codebase (not imported from a black-box package), so you own
and can tweak every line.

> Published as `@damo-ui/cli` during the 0.x line; at the 1.0 cutover it takes
> the bare `damo-ui` name (so `npx damo-ui add …`). The `bin` is already
> `damo-ui`.

## Usage

```bash
# 1. scaffold components.json
npx @damo-ui/cli init

# 2. add components (pulls their cn/icons/i18n deps + installs npm packages)
npx @damo-ui/cli add button dialog

# add directly from a URL
npx @damo-ui/cli add https://damo-ui.com/r/ui/button.json

# 3. browse what's available
npx @damo-ui/cli list
```

## Commands

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `init`               | Write `components.json` (detects `src/` layout + your globals.css). |
| `add <component...>` | Copy components + their transitive registry deps; install npm deps. |
| `list`               | List everything in the registry, grouped by kind.                   |

## Options

| Flag                   | Default                 | Notes                                             |
| ---------------------- | ----------------------- | ------------------------------------------------- |
| `-r, --registry <url>` | `https://damo-ui.com/r` | Registry base URL.                                |
| `--cwd <dir>`          | `.`                     | Target project directory.                         |
| `--overwrite`          | off                     | Overwrite files that already exist.               |
| `--no-deps`            | —                       | Skip installing npm dependencies.                 |
| `-f, --force`          | off                     | Overwrite an existing `components.json` (`init`). |
| `-y, --yes`            | off                     | Assume defaults / skip prompts.                   |

The registry URL can also be set with the `DAMO_UI_REGISTRY` env var.

## How it works

`add` fetches the registry item JSON, follows `registryDependencies`
transitively (so `dialog` pulls `cn`, `icons`, `i18n`…), rewrites nothing
(the registry already ships `@/`-aliased imports), writes each file to the
path implied by your `components.json` aliases, then installs the union of npm
`dependencies` with your detected package manager.

Zero runtime dependencies — just Node ≥ 18 (uses the built-in `fetch`).

## Attribution

A focused, dependency-free reimplementation of the
[shadcn](https://ui.shadcn.com) CLI workflow, compatible with the
`components.json` schema. See [`NOTICE`](./NOTICE).
