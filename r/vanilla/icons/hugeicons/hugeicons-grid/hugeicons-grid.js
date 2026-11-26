import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "grid",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 3V21"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 3V21"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 7L3 7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 17L3 17"
      }
    }
  ],
  "accents": [
    1,
    2,
    3
  ]
};

export const meta = {
  "slug": "hugeicons-grid",
  "family": "hugeicons",
  "name": "grid",
  "category": "Interface",
  "motion": "pop",
  "component": "createHugeiconsGridIcon"
};

export function createHugeiconsGridIcon(root, options = {}) {
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
