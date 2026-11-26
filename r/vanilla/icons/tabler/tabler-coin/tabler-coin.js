import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "coin",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 7v10"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-coin",
  "family": "tabler",
  "name": "coin",
  "category": "Commerce",
  "motion": "coin",
  "component": "createTablerCoinIcon"
};

export function createTablerCoinIcon(root, options = {}) {
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
