import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-up-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-arrow-up-right",
  "family": "heroicons",
  "name": "arrow-up-right",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createHeroiconsArrowUpRightIcon"
};

export function createHeroiconsArrowUpRightIcon(root, options = {}) {
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
