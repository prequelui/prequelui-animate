import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "percentage",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 18l12 -12"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-percentage",
  "family": "tabler",
  "name": "percentage",
  "category": "Commerce",
  "motion": "coin",
  "component": "createTablerPercentageIcon"
};

export function createTablerPercentageIcon(root, options = {}) {
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
