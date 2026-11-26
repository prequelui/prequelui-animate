import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-left-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M19.9999 17L3.99994 17"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 14C17 14 19.9999 16.2095 19.9999 17C19.9999 17.7906 16.9999 20 16.9999 20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.99994 7L19.9999 7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6.99992 4C6.99992 4 3.99995 6.20947 3.99994 7.00002C3.99993 7.79058 6.99994 10 6.99994 10"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "hugeicons-arrow-left-right",
  "family": "hugeicons",
  "name": "arrow-left-right",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createHugeiconsArrowLeftRightIcon"
};

export function createHugeiconsArrowLeftRightIcon(root, options = {}) {
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
