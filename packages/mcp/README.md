# @axologic/mcp

An [MCP](https://modelcontextprotocol.io) server for
[damo-ui](https://github.com/simoneschioppo/damo-ui). It lets AI coding agents
(Claude Code, Claude Desktop, Cursor, …) **discover and install** damo-ui
components straight from the registry — search the catalog, read a component's
source, or drop it into your project, all from inside the editor.

## Tools

| Tool                 | What it does                                                           |
| -------------------- | ---------------------------------------------------------------------- |
| `search_components`  | Search the registry by name/title (empty query = list everything).     |
| `get_component_code` | Return a component's raw source + its npm / registry dependencies.     |
| `add_component`      | Copy a component into a project (runs the damo-ui CLI under the hood). |
| `list_blocks`        | List composite/block-like components.                                  |
| `get_theme_tokens`   | Return the design tokens / theme / global CSS.                         |

Stdio transport — the standard for editor integrations.

## Configure your client

### Claude Code

```bash
claude mcp add damo-ui -- npx -y @axologic/mcp
```

or add to a project `.mcp.json`:

```json
{
  "mcpServers": {
    "damo-ui": { "command": "npx", "args": ["-y", "@axologic/mcp"] }
  }
}
```

### Cursor

`~/.cursor/mcp.json` (or a project `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "damo-ui": { "command": "npx", "args": ["-y", "@axologic/mcp"] }
  }
}
```

### Claude Desktop

`claude_desktop_config.json` — same `mcpServers` block as above.

## Configuration (env vars)

| Variable           | Default                 | Purpose                                |
| ------------------ | ----------------------- | -------------------------------------- |
| `DAMO_UI_REGISTRY` | `https://damo-ui.com/r` | Registry base URL the tools read from. |
| `DAMO_UI_CLI`      | `npx -y @axologic/cli`  | Command `add_component` shells out to. |

```json
{
  "mcpServers": {
    "damo-ui": {
      "command": "npx",
      "args": ["-y", "@axologic/mcp"],
      "env": { "DAMO_UI_REGISTRY": "http://localhost:3000/r" }
    }
  }
}
```

## Example

> "Search damo-ui for a dialog, show me its code, then add it to
> `/path/to/my-app`."

Claude calls `search_components` → `get_component_code` → `add_component`,
and the component lands in your project.

Requires Node ≥ 18.
