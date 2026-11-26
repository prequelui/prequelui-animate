import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-left-01",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-arrow-left-01",
  "family": "hugeicons",
  "name": "arrow-left-01",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createHugeiconsArrowLeft01Icon"
};

export function createHugeiconsArrowLeft01Icon(root, options = {}) {
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
