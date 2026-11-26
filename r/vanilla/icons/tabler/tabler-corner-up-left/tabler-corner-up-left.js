import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "corner-up-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 18v-6a3 3 0 0 0 -3 -3h-10l4 -4m0 8l-4 -4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-corner-up-left",
  "family": "tabler",
  "name": "corner-up-left",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createTablerCornerUpLeftIcon"
};

export function createTablerCornerUpLeftIcon(root, options = {}) {
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
