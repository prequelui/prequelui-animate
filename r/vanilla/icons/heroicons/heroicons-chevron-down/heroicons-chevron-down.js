import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevron-down",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m19.5 8.25-7.5 7.5-7.5-7.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-chevron-down",
  "family": "heroicons",
  "name": "chevron-down",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createHeroiconsChevronDownIcon"
};

export function createHeroiconsChevronDownIcon(root, options = {}) {
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
