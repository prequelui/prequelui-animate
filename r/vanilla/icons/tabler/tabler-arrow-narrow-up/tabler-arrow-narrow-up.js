import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-narrow-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideUp",
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
        "d": "M16 9l-4 -4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 9l4 -4"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-arrow-narrow-up",
  "family": "tabler",
  "name": "arrow-narrow-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createTablerArrowNarrowUpIcon"
};

export function createTablerArrowNarrowUpIcon(root, options = {}) {
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
