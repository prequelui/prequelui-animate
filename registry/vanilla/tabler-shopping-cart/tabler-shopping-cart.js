import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "shopping-cart",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 17h-11v-14h-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 5l14 1l-1 7h-13"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-shopping-cart",
  "family": "tabler",
  "name": "shopping-cart",
  "category": "Commerce",
  "motion": "bounce",
  "component": "createTablerShoppingCartIcon"
};

export function createTablerShoppingCartIcon(root, options = {}) {
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
