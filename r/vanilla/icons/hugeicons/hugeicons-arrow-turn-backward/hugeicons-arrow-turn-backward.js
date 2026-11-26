import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-turn-backward",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11 6H15.5C17.9853 6 20 8.01472 20 10.5C20 12.9853 17.9853 15 15.5 15H4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6.99998 12C6.99998 12 4.00001 14.2095 4 15C3.99999 15.7906 7 18 7 18"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-arrow-turn-backward",
  "family": "hugeicons",
  "name": "arrow-turn-backward",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createHugeiconsArrowTurnBackwardIcon"
};

export function createHugeiconsArrowTurnBackwardIcon(root, options = {}) {
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
