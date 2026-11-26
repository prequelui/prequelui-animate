import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-up",
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
        "d": "M18 11l-6 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 11l6 -6"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-arrow-up",
  "family": "tabler",
  "name": "arrow-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createTablerArrowUpIcon"
};

export function createTablerArrowUpIcon(root, options = {}) {
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
