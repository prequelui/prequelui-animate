import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-uturn-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-arrow-uturn-right",
  "family": "heroicons",
  "name": "arrow-uturn-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createHeroiconsArrowUturnRightIcon"
};

export function createHeroiconsArrowUturnRightIcon(root, options = {}) {
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
