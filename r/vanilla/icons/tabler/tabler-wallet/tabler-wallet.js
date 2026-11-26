import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "wallet",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12v4h-4a2 2 0 0 1 0 -4h4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-wallet",
  "family": "tabler",
  "name": "wallet",
  "category": "Commerce",
  "motion": "coin",
  "component": "createTablerWalletIcon"
};

export function createTablerWalletIcon(root, options = {}) {
  let current = { ...options };
  const render = () => {
    root.innerHTML = renderSetIcon(definition, current);
  };
  render();
  const controller = bindSetIcon(root, definition, () => current);
  return {
    play: controller.play,
    reset: controller.reset,
    destroy: controller.destroy,
    update(next = {}) {
      current = { ...current, ...next };
      render();
    },
    get observed() {
      return controller.observed;
    },
  };
}
