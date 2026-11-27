<p align="center">
  <a href="https://prequeluianimate.terravidhal.me"><img src="logo/logo.svg" alt="PrequelUI Animate" width="96"></a>
</p>

<h1 align="center">PrequelUI Animate</h1>

<p align="center">
  <b>Every framework. The same motion.</b><br>
  Animated components for React, Vue, Svelte, Solid and plain JavaScript, installed with the shadcn CLI.
</p>

```bash
npx shadcn@latest add https://prequeluianimate.terravidhal.me/r/react/dialog.json
```

<p align="center">
  <a href="https://prequeluianimate.terravidhal.me"><b>Website</b></a> ·
  <a href="https://prequeluianimate.terravidhal.me/components">Components</a> ·
  <a href="https://prequeluianimate.terravidhal.me/icons">Icons</a> ·
  <a href="https://prequeluianimate.terravidhal.me/docs/installation">Installation</a> ·
  <a href="https://prequeluianimate.terravidhal.me/tools/mcp">MCP server</a> ·
  <a href="../../issues/new">Request a component</a>
</p>

<p align="center">
  <a href="https://ui.shadcn.com/docs/directory"><img src="https://img.shields.io/badge/shadcn-official%20directory-black" alt="shadcn registry"></a>
  <a href="https://www.npmjs.com/package/@prequelui/bot"><img src="https://img.shields.io/npm/v/@prequelui/bot?label=%40prequelui%2Fbot&color=black" alt="npm @prequelui/bot"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-black" alt="MIT license"></a>
  <a href="https://github.com/prequelui/prequelui-animate/stargazers"><img src="https://img.shields.io/github/stars/prequelui/prequelui-animate?style=flat&color=black" alt="GitHub stars"></a>
</p>

> ⭐ **If PrequelUI Animate saves you from rewriting an animation for another framework, a star helps other developers find it.** It takes one click and it is the best way to support the project.

---

## Why PrequelUI Animate

An animation written for React usually has to be rewritten for Vue, then for Svelte, and it never feels quite the same. PrequelUI Animate ships each component in five frameworks with the same timing, the same easing and the same API, so your product moves the same way everywhere.

## What is inside

- **31 Base UI primitives** (accordion, dialog, tabs, tooltip…) for React, Vue, Svelte, Solid and JavaScript. Angular uses the JavaScript file.
- **92 animated components** in five frameworks: buttons, texts, numbers, effects and backgrounds.
- **Animated icons**, **isometric line objects** and **category pictograms**, each one a registry item.
- **Templates**: complete pages built from the registry, in every framework.
- **`@prequelui/bot`**: a development-only overlay that lets you pick an element on your own page and change it live.
- **`prequelui-animate init`**: a CLI that reads your project, prints a plan, waits for a yes, then installs and verifies the build.
- **An MCP server**, so coding agents (Claude, Cursor, Windsurf, VS Code) can search, describe and install items.
- **Agent skills** for coding agents: <https://prequeluianimate.terravidhal.me/skills>.

Every component respects `prefers-reduced-motion`.

## Use it

### shadcn CLI

In a project that already uses shadcn/ui:

```bash
npx shadcn@latest add https://prequeluianimate.terravidhal.me/r/react/dialog.json
```

Swap `react` for `vue`, `svelte`, `solid` or `vanilla` to get the same component for another framework. The CLI copies the source into your project: you own the code.

### Guided install

```bash
npx prequelui-animate init
```

### The bot

```bash
npm install -D @prequelui/bot
```

See the [bot guide](https://prequeluianimate.terravidhal.me/docs/bot).

### MCP server

Setup for each agent: <https://prequeluianimate.terravidhal.me/tools/mcp>.

## Repository layout

| Folder | Content |
| --- | --- |
| [`components/prequelui`](components/prequelui) | React sources of the animated components, icons and objects |
| [`registry`](registry) | Base UI primitives for each framework (`react`, `vue`, `svelte`, `solid`, `vanilla`) |
| [`lib`](lib) | Shared helpers (`cn`, reduced motion, icon styles) |
| [`r`](r) | The built shadcn registry, as served at `prequeluianimate.terravidhal.me/r` |
| [`packages/init`](packages/init) | The `prequelui-animate` CLI |
| [`packages/bot`](packages/bot) | The `@prequelui/bot` overlay |
| [`mcp`](mcp) | The MCP server (`@prequelui/mcp`) |
| [`logo`](logo) | Logo and mascot |

The website lives in a separate private repository and uses this one as a Git submodule.

## Contributing

Every kind of help counts, and you don't need to write code to help.

**Report a bug.** [Open an issue](../../issues/new) with the component name, the framework (React, Vue, Svelte, Solid or JavaScript), what you expected, what happened, and a link or a short code sample that reproduces it.

**Request a component.** [Open an issue](../../issues/new) with what it should do, a link to an example you like, and the frameworks you need. We agree on its motion and its API before any code is written.

**Improve a component or add one.**

1. Open an issue first, so nobody works twice on the same thing.
2. Fork the repository and create a branch: `git checkout -b fix/dialog-focus`.
3. Change the source in [`components/prequelui`](components/prequelui) (animated components) or in [`registry/<framework>`](registry) (primitives). A new component needs the same behaviour in all five frameworks.
4. Keep the rules of the library:
   - same timing, easing and props in every framework;
   - an alternative for `prefers-reduced-motion`;
   - keyboard and screen-reader access kept from Base UI;
   - no new runtime dependency unless we agreed on it in the issue.
5. Test it in a real project: install it with the shadcn CLI from your branch and check it in light and dark mode.
6. Open a pull request that links the issue, with a short video or GIF of the motion.

**Improve the docs.** Typos, unclear steps and missing examples are welcome as pull requests too.

**Share it.** A star, a post or a mention to a friend who builds UIs helps the project grow.

Please be kind and constructive in issues and pull requests.

## Star history

<a href="https://star-history.com/#prequelui/prequelui-animate&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=prequelui/prequelui-animate&type=Date&theme=dark">
    <img alt="Star history of PrequelUI Animate" src="https://api.star-history.com/svg?repos=prequelui/prequelui-animate&type=Date" width="600">
  </picture>
</a>

## License

[MIT](LICENSE). Built by [Terra Vidhal](https://github.com/terravidhal).

---

**PrequelUI Animate is free and open source.** If it helped you, [⭐ star the repo](https://github.com/prequelui/prequelui-animate): it is the best way to help other developers find it.
