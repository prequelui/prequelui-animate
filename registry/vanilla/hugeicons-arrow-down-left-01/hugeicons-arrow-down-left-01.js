import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down-left-01",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 17.3497C15 17.3497 8.06166 17.8924 7.08461 16.9154C6.10755 15.9383 6.65037 9 6.65037 9M7.5 16.5L17.5 6.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-arrow-down-left-01",
  "family": "hugeicons",
  "name": "arrow-down-left-01",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createHugeiconsArrowDownLeft01Icon"
};

export function createHugeiconsArrowDownLeft01Icon(root, options = {}) {
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
