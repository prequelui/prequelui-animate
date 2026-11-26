import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "circle-check",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "check",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 12l2 2l4 -4"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-circle-check",
  "family": "tabler",
  "name": "circle-check",
  "category": "Interface",
  "motion": "check",
  "component": "createTablerCircleCheckIcon"
};

export function createTablerCircleCheckIcon(root, options = {}) {
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
