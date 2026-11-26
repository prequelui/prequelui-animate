import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "rotate-ccw",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 3v5h5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-rotate-ccw",
  "family": "lucide",
  "name": "rotate-ccw",
  "category": "Navigation",
  "motion": "spin",
  "component": "createLucideRotateCcwIcon"
};

export function createLucideRotateCcwIcon(root, options = {}) {
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
