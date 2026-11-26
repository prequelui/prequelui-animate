import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "corner-up-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 18v-6a3 3 0 0 1 3 -3h10l-4 -4m0 8l4 -4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-corner-up-right",
  "family": "tabler",
  "name": "corner-up-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createTablerCornerUpRightIcon"
};

export function createTablerCornerUpRightIcon(root, options = {}) {
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
