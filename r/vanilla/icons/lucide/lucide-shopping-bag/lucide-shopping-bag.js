import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "shopping-bag",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16 10a4 4 0 0 1-8 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.103 6.034h17.794"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-shopping-bag",
  "family": "lucide",
  "name": "shopping-bag",
  "category": "Commerce",
  "motion": "bounce",
  "component": "createLucideShoppingBagIcon"
};

export function createLucideShoppingBagIcon(root, options = {}) {
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
