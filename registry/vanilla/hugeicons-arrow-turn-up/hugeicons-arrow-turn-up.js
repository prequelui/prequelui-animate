import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-turn-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 11L6 15.5C6 17.9853 8.01472 20 10.5 20C12.9853 20 15 17.9853 15 15.5V4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 6.99998C18 6.99998 15.7905 4.00001 15 4C14.2094 3.99999 12 7 12 7"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-arrow-turn-up",
  "family": "hugeicons",
  "name": "arrow-turn-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createHugeiconsArrowTurnUpIcon"
};

export function createHugeiconsArrowTurnUpIcon(root, options = {}) {
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
