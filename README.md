<p align="center">
  <a href="https://prequeluianimate.terravidhal.me"><img src="logo/logo.svg" alt="PrequelUI Animate" width="96"></a>
</p>

<h1 align="center">PrequelUI Animate</h1>

<p align="center">
  Every framework. The same motion.<br>
  Animated components for React, Vue, Svelte, Solid and plain JavaScript, installed with the shadcn CLI.
</p>

<p align="center">
  <a href="https://prequeluianimate.terravidhal.me/components">Components</a> ·
  <a href="https://prequeluianimate.terravidhal.me/icons">Icons</a> ·
  <a href="https://prequeluianimate.terravidhal.me/docs/installation">Installation</a> ·
  <a href="https://prequeluianimate.terravidhal.me/tools/mcp">MCP server</a>
</p>

## What is inside

- **31 Base UI primitives** (accordion, dialog, tabs, tooltip…) for React, Vue, Svelte, Solid and JavaScript. Angular uses the JavaScript file.
- **92 animated components** in five frameworks: buttons, texts, numbers, effects and backgrounds.
- **Animated icons**, **isometric line objects** and **category pictograms**, each one a registry item.
- **`prequelui-animate init`**, a CLI that reads your project, prints a plan, waits for a yes, then installs and verifies the build.
- **An MCP server**, so coding agents can search, describe and install items.

Every component respects `prefers-reduced-motion`.

## Install a component

In a project that already uses shadcn/ui:

```bash
npx shadcn@latest add https://prequeluianimate.terravidhal.me/r/react/dialog.json
```

Swap `react` for `vue`, `svelte`, `solid` or `vanilla` to get the same component for another framework. The CLI copies the source into your project. You own the code.

## Repository layout

| Folder | Content |
| --- | --- |
| [`components/prequelui`](components/prequelui) | React sources of the animated components, icons and objects |
| [`registry`](registry) | Base UI primitives for each framework (`react`, `vue`, `svelte`, `solid`, `vanilla`) |
| [`lib`](lib) | Shared helpers (`cn`, reduced motion, icon styles) |
| [`r`](r) | The built shadcn registry, as served at `prequeluianimate.terravidhal.me/r` |
| [`packages/init`](packages/init) | The `prequelui-animate` CLI |
| [`mcp`](mcp) | The MCP server (`@prequelui/mcp`) |
| [`logo`](logo) | Logo and mascot |

The website lives in a separate private repository and uses this one as a Git submodule.

## Contributing

Issues and pull requests are welcome. Please open an issue first for a new component, so we can agree on its motion and its API before any code is written.

## License

[MIT](LICENSE)
