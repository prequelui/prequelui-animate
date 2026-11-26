import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-narrow-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l14 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 16l4 -4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 8l4 4"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-arrow-narrow-right",
  "family": "tabler",
  "name": "arrow-narrow-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createTablerArrowNarrowRightIcon"
};

export function createTablerArrowNarrowRightIcon(root, options = {}) {
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
