import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-turn-forward",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M13 6H8.5C6.01472 6 4 8.01472 4 10.5C4 12.9853 6.01472 15 8.5 15H20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 12C17 12 20 14.2095 20 15C20 15.7906 17 18 17 18"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-arrow-turn-forward",
  "family": "hugeicons",
  "name": "arrow-turn-forward",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createHugeiconsArrowTurnForwardIcon"
};

export function createHugeiconsArrowTurnForwardIcon(root, options = {}) {
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
