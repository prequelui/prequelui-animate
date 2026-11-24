# @prequelui/bot

A development-only overlay that lives in the corner of your page. Click the mascot, pick an
element, read three motion proposals, preview them live on the real element, then copy the code
for React, Vue, Svelte, Solid or vanilla JavaScript.

The overlay is a single Web Component rendered in a Shadow DOM. It does not run in production
unless the page explicitly opts into a scoped demo.

## Script

```html
<script src="/bot/v2.js" data-prequel-bot="dev" defer></script>
```

The script stops silently unless `data-prequel-bot="dev"` is present and the page is served from
localhost, a `.local` host, a private IP, or a host listed in `data-hosts`. Opt out with
`<meta name="prequel-bot" content="off">`, `?prequel=off`, or `window.__PREQUEL_BOT_DISABLED__`.

```html
<script
  src="/bot/v2.js"
  data-prequel-bot="dev"
  data-hosts="staging.example.com,preview.example.com"
  data-config='{"position":"bl","size":56,"hotkey":"Alt+Shift+A"}'
  defer
></script>
```

## Scoped demo

A public host stays blocked unless you ask for a demo with `force`, `demo` and a CSS `scope`.
Only the descendants of the scope become selectable, the mascot docks inside its visible corner,
and a discreet Demo badge marks the overlay. Without all three options the guard still refuses.

```html
<script
  src="/bot/v2.js"
  data-prequel-bot="dev"
  data-config='{"force":true,"demo":true,"scope":"#playground"}'
  defer
></script>
```

## Package

```tsx
import { PrequelBot } from "@prequelui/bot/react";

export function DevBot() {
  if (process.env.NODE_ENV === "production") return null;
  return <PrequelBot framework="react" />;
}
```

Vue, Svelte and Solid exports are thin adapters around the same vanilla core. The React export
mounts the validated mascot component from the site; the other exports use the compiled mascot
with the same shapes and states.

## Configuration

| Option | Type | Default | Role |
| --- | --- | --- | --- |
| `position` | `"br" \| "bl" \| "tr" \| "tl"` | `"br"` | Initial mascot corner |
| `size` | `number` | `64` | Diameter of the white disk |
| `label` | `string \| null` | `"PREQUEL BOT"` | Label under the mascot |
| `showLabel` | `boolean` | `true` | Hide the label on small screens |
| `framework` | `"react" \| "vue" \| "svelte" \| "solid" \| "vanilla"` | `"react"` | Initial code tab |
| `allowHosts` | `string[]` | `[]` | Extra development hosts |
| `registryUrl` | `string \| null` | embedded | Optional remote catalogue |
| `hotkey` | `string \| false` | `"Alt+Shift+A"` | Arm the picker |
| `bridge` | `{ url, token? } \| false` | `false` | Local MCP bridge |
| `reducedMotion` | `"system" \| "always" \| "never"` | `"system"` | Motion policy |
| `force` | `boolean` | `false` | Allow a scoped demo on a public host |
| `demo` | `boolean` | `false` | Show the Demo badge and the demo wording |
| `scope` | `string \| null` | `null` | CSS selector that limits selectable elements |
| `onApply` | `(payload) => void` | — | Application hook |

## Keyboard

`Alt+Shift+A` arms the picker. `Tab` and the arrows walk the page, `Enter` selects, `P` reads the
target, `O` opens the page outline, `Escape` stops the preview then closes the panel. The panel
uses `role="dialog"`, the cards are a radiogroup, and every status is announced.

## Bridge

```bash
npx -p @prequelui/bot prequelui-bot-bridge --port 4318
```

The bridge binds to `127.0.0.1` only, shows a six-digit pairing code, keeps a 15-minute token in
memory and writes it to `~/.prequelui-bot-token` for the MCP server. The optional MCP tools
(`get_bot_request`, `complete_bot_request`, `cancel_bot_request`) are registered only when
`PREQUELUI_BOT_BRIDGE` is set.

## Live preview

Previews use the Web Animations API on the selected element. Switching cards, closing the panel,
pressing Escape, navigating, or hiding the tab cancels every animation and restores the element.
Text recipes save and restore the original child nodes; numeric recipes restore the original text.
`prefers-reduced-motion` removes translation, rotation and scale.

## Development

```bash
npm run lint:typecheck
npm run lint:test
npm run lint:bridgetest
npm run lint:build
```

`lint:build` writes `dist/` and copies the standalone script to `web/public/bot/v2.js`.

MIT · PrequelUI.
