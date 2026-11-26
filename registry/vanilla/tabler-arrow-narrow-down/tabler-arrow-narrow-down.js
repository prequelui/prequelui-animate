import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-narrow-down",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 5l0 14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 15l-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 15l4 4"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-arrow-narrow-down",
  "family": "tabler",
  "name": "arrow-narrow-down",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createTablerArrowNarrowDownIcon"
};

export function createTablerArrowNarrowDownIcon(root, options = {}) {
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
