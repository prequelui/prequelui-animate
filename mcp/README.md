# PrequelUI MCP

A Model Context Protocol server for the **PrequelUI Animate** registry: animated
shadcn/ui primitives, effects, backgrounds and icons. It lets Claude, Cursor,
VS Code and any MCP client search the catalogue, read a component contract and
get the exact install command for React, Vue, Svelte, Solid or plain JavaScript.

The server is read-only. It reads `web/public/r/` and never writes to it.

## Requirements

- Node.js 18 or newer
- For installing components: the matching shadcn CLI in the target project

## Quick start

The server is not published on npm yet. Clone this repository and point every
client at `mcp/server.mjs` with `node`; the path below is the only value to
replace.

### Claude Code

```bash
claude mcp add prequelui -- node /path/to/prequelui-animate/mcp/server.mjs
```

Or commit a project-scoped `.mcp.json`:

```json
{
  "mcpServers": {
    "prequelui": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/prequelui-animate/mcp/server.mjs"]
    }
  }
}
```

### Claude Desktop

Edit `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "prequelui": {
      "command": "node",
      "args": ["/path/to/prequelui-animate/mcp/server.mjs"]
    }
  }
}
```

Restart Claude Desktop. The `prequelui` server appears in the tools menu.

### Cursor

Create `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` globally:

```json
{
  "mcpServers": {
    "prequelui": {
      "command": "node",
      "args": ["/path/to/prequelui-animate/mcp/server.mjs"]
    }
  }
}
```

Open **Settings → MCP** and enable the server.

### VS Code (GitHub Copilot / MCP)

Create `.vscode/mcp.json`:

```json
{
  "servers": {
    "prequelui": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/prequelui-animate/mcp/server.mjs"]
    }
  }
}
```

Run **MCP: List Servers** from the command palette and start `prequelui`.

### From this repository

No install is needed: the server falls back to the SDK already present in
`web/node_modules` and reads `web/public/r/` relative to its own file.

```json
{
  "mcpServers": {
    "prequelui": {
      "command": "node",
      "args": ["/absolute/path/to/prequelui-animate/mcp/server.mjs"]
    }
  }
}
```

Check the wiring from a terminal:

```bash
node mcp/server.mjs --check
```

It prints the registry path, the site URL and the item counts. The normal
stdio mode is silent on stdout: logs go to stderr only.

## Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `search_components` | `query`, `usage`, `category`, `framework`, `limit` | Ranked components with description, tags, docs URL and an install command. |
| `describe_component` | `name` | Category, dependencies, files, available frameworks, every install command and related components. |
| `get_install_command` | `name`, `framework` | The exact `shadcn`, `shadcn-vue`, `shadcn-svelte`, Solid or `curl` command. |
| `suggest_components` | `request`, `framework`, `limit` (2–3) | Two or three components that fit a plain-language request, with a reason. |

Resources:

- `prequelui://catalog` — compact JSON catalogue of every registry item.
- `prequelui://component/{name}` — full description of one item.

### Examples

```text
Find a dialog component.
```

```text
I need an animated entrance for my pricing page.
```

```text
Give me the Vue install command for the accordion.
```

```text
Suggest two components for a GitHub star counter.
```

The suggestion engine understands French and English. For example,
`entrée animée pour ma page tarifs` returns entrance effects and pricing-page
treatments such as blur, fade, slide, tilt or shine.

## Install commands

```bash
# React
npx shadcn@latest add https://apercu-animate.terravidhal.me/design/r/react/accordion.json

# Vue 3
npx shadcn-vue@latest add https://apercu-animate.terravidhal.me/design/r/vue/accordion.json

# Svelte 5
npx shadcn-svelte@latest add https://apercu-animate.terravidhal.me/design/r/svelte/accordion.json

# Solid
npx shadcn@latest add https://apercu-animate.terravidhal.me/design/r/solid/accordion.json

# Icons (React)
npx shadcn@latest add https://apercu-animate.terravidhal.me/design/r/react/icons/bell.json
```

Components that only exist for React use the root registry URL
(`/r/<name>.json`). The tool always returns the correct one, so prefer calling
`get_install_command` instead of building a URL by hand.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PREQUELUI_REGISTRY_DIR` | `<repo>/web/public/r` | Registry folder to read. |
| `PREQUELUI_WEB_DIR` | `<repo>/web` | Web app folder, used to read `lib/catalog.ts` for categories. |
| `PREQUELUI_SITE_URL` | `https://apercu-animate.terravidhal.me/design` | Base URL used in docs links and install commands. |

## Tests

From the repository root:

```bash
npm run lint:mcp        # registry + tool unit tests
npm run lint:mcpe2e     # spawns the server and calls it over stdio
npm run lint:mcpcheck   # registry path and counts
```

From `mcp/`:

```bash
npm run lint:test
npm run lint:e2e
```

## Troubleshooting

**`npx @prequelui/mcp` cannot find the package.** The package is part of this
repository and is not published on npm. Use the local `node mcp/server.mjs`
configuration above.

**`Cannot find module @modelcontextprotocol/sdk`.** Run `npm install` inside
`mcp/`, or run from the repository where the fallback can load the SDK from
`web/node_modules`.

**No components found.** Check `node mcp/server.mjs --check`; the registry
folder must contain `registry.json` and the framework registries.

## License

MIT. The catalogue and its source are free to use, modify and redistribute.
