import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-narrow-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideLeft",
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
        "d": "M5 12l4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l4 -4"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-arrow-narrow-left",
  "family": "tabler",
  "name": "arrow-narrow-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createTablerArrowNarrowLeftIcon"
};

export function createTablerArrowNarrowLeftIcon(root, options = {}) {
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
