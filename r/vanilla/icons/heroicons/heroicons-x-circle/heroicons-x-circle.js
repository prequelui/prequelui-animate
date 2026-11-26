import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "x-circle",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "close",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-x-circle",
  "family": "heroicons",
  "name": "x-circle",
  "category": "Interface",
  "motion": "close",
  "component": "createHeroiconsXCircleIcon"
};

export function createHeroiconsXCircleIcon(root, options = {}) {
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
