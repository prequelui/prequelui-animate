import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down-right-01",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9 17.3497C9 17.3497 15.9383 17.8924 16.9154 16.9154C17.8924 15.9383 17.3496 9 17.3496 9M16.5 16.5L6.5 6.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-arrow-down-right-01",
  "family": "hugeicons",
  "name": "arrow-down-right-01",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createHugeiconsArrowDownRight01Icon"
};

export function createHugeiconsArrowDownRight01Icon(root, options = {}) {
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
