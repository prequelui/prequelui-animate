import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-arrow-right",
  "family": "heroicons",
  "name": "arrow-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createHeroiconsArrowRightIcon"
};

export function createHeroiconsArrowRightIcon(root, options = {}) {
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
