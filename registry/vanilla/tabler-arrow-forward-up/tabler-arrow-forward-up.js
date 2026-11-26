import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-forward-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 14l4 -4l-4 -4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 10h-11a4 4 0 1 0 0 8h1"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-arrow-forward-up",
  "family": "tabler",
  "name": "arrow-forward-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createTablerArrowForwardUpIcon"
};

export function createTablerArrowForwardUpIcon(root, options = {}) {
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
