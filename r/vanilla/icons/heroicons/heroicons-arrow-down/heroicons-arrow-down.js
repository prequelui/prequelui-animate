import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-arrow-down",
  "family": "heroicons",
  "name": "arrow-down",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createHeroiconsArrowDownIcon"
};

export function createHeroiconsArrowDownIcon(root, options = {}) {
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
