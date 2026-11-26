import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevrons-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11 7l-5 5l5 5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 7l-5 5l5 5"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-chevrons-left",
  "family": "tabler",
  "name": "chevrons-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createTablerChevronsLeftIcon"
};

export function createTablerChevronsLeftIcon(root, options = {}) {
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
