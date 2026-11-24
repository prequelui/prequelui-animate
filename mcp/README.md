# PrequelUI MCP

A Model Context Protocol server for the **PrequelUI Animate** registry: animated
shadcn/ui primitives, effects, backgrounds and icons. It lets Claude, Cursor,
VS Code, Windsurf and any MCP client search the catalogue, read a component
contract and get the exact install command for React, Vue, Svelte, Solid or
plain JavaScript.

The server is read-only. It reads the public registry from
`https://prequeluianimate.terravidhal.me/r/` and never writes to it.

## Requirements

- Node.js 18 or newer
- For installing components: the matching shadcn CLI in the target project

## Quick start

No installation or clone is required:

```bash
npx -y @prequelui/mcp
```

The process speaks MCP over stdio. Configure your client to run that command;
the sections below show the exact file or command for each one.

### Claude Code

```bash
claude mcp add prequelui -- npx -y @prequelui/mcp
```

Or commit a project-scoped `.mcp.json`:

```json
{
  "mcpServers": {
    "prequelui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@prequelui/mcp"]
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
      "command": "npx",
      "args": ["-y", "@prequelui/mcp"]
    }
  }
}
```

On Windows, wrap the command: `"command": "cmd", "args": ["/c", "npx", "-y",
"@prequelui/mcp"]`. Restart Claude Desktop; the `prequelui` server appears in
the tools menu.

### Cursor

Create `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` globally:

```json
{
  "mcpServers": {
    "prequelui": {
      "command": "npx",
      "args": ["-y", "@prequelui/mcp"]
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
      "command": "npx",
      "args": ["-y", "@prequelui/mcp"]
    }
  }
}
```

Run **MCP: List Servers** from the command palette and start `prequelui`.

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "prequelui": {
      "command": "npx",
      "args": ["-y", "@prequelui/mcp"]
    }
  }
}
```

Open **Cascade → MCP Servers**, then refresh the panel.

### Check the wiring

```bash
npx -y @prequelui/mcp --check
```

It prints a JSON summary with the registry source, the site URL and the item
counts, then exits without starting a session. The normal stdio mode is silent
on stdout: logs go to stderr only.

### Run from source

Contributors can run the server straight from a clone. Install once in `mcp/`,
then point the client at `server.mjs`; there is no build step.

```bash
git clone https://github.com/prequelui/prequelui-animate.git
cd prequelui-animate/mcp
npm install
node server.mjs
```

In the client config, keep `"command": "node"` and pass the absolute path to
`server.mjs`. Set `PREQUELUI_REGISTRY_DIR` to read the clone's own `r/` folder
instead of the published one.

## Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `search_components` | `query`, `usage`, `category`, `framework`, `limit` | Ranked components with description, tags, docs URL and an install command. |
| `describe_component` | `name` | Category, dependencies, files, available frameworks, every install command and related components. |
| `get_install_command` | `name`, `framework` | The exact `shadcn`, `shadcn-vue`, `shadcn-svelte`, Solid or `curl` command. |
| `suggest_components` | `request`, `framework`, `limit` (2–3) | Two or three components that fit a plain-language request, with a reason. |

When `PREQUELUI_BOT_BRIDGE` is set, three local tools are also exposed:
`get_bot_request`, `complete_bot_request` and `cancel_bot_request`.

Resources:

- `prequelui://catalog` — compact JSON catalogue of every registry item.
- `prequelui://component/{name}` — full description of one item.
- `prequelui://bot/inbox` — queued and recent overlay requests (bridge only).

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
npx shadcn@latest add https://prequeluianimate.terravidhal.me/r/react/accordion.json

# Vue 3
npx shadcn-vue@latest add https://prequeluianimate.terravidhal.me/r/vue/accordion.json

# Svelte 5
npx shadcn-svelte@latest add https://prequeluianimate.terravidhal.me/r/svelte/accordion.json

# Solid
npx shadcn@latest add https://prequeluianimate.terravidhal.me/r/solid/accordion.json

# Icons (React)
npx shadcn@latest add https://prequeluianimate.terravidhal.me/r/react/icons/bell.json
```

Components that only exist for React use the root registry URL
(`/r/<name>.json`). The tool always returns the correct one, so prefer calling
`get_install_command` instead of building a URL by hand.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PREQUELUI_SITE_URL` | `https://prequeluianimate.terravidhal.me` | Base URL used to read the registry, build docs links and install commands. |
| `PREQUELUI_REGISTRY_DIR` | auto-detected | Read a local registry folder instead of the online one. |
| `PREQUELUI_WEB_DIR` | auto-detected | Web app folder, used to read `lib/catalog.ts` for categories. |
| `PREQUELUI_BOT_BRIDGE` | unset | URL of a running PrequelUI Bot bridge. Enables the bot tools. |
| `PREQUELUI_BOT_TOKEN` | `~/.prequelui-bot-token` | Bearer token for the bot bridge. |

By default the server loads the catalogue from the live site. Point
`PREQUELUI_REGISTRY_DIR` at a local `r/` folder to work offline.

## Tests

From the package folder:

```bash
npm run lint:test     # registry + tool unit tests
npm run lint:e2e      # spawns the server and calls it over stdio
npm run lint:stdio    # raw JSON-RPC session against a server file
npm run lint:check    # registry source and counts
```

`lint:stdio` accepts a path to a server file, which makes it usable against a
packed tarball:

```bash
node tests/stdio.test.mjs node_modules/@prequelui/mcp/server.mjs
```

## License

MIT. The catalogue and its source are free to use, modify and redistribute.
