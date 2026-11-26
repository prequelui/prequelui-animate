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
        "d": "m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "18",
        "cy": "20",
        "r": "2"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "8",
        "cy": "20",
        "r": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-shopping-cart",
  "family": "lucide",
  "name": "shopping-cart",
  "category": "Commerce",
  "motion": "bounce",
  "component": "createLucideShoppingCartIcon"
};

export function createLucideShoppingCartIcon(root, options = {}) {
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
