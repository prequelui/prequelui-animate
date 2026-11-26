import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "shield-check",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "check",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m9 12 2 2 4-4"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-shield-check",
  "family": "lucide",
  "name": "shield-check",
  "category": "Status",
  "motion": "check",
  "component": "createLucideShieldCheckIcon"
};

export function createLucideShieldCheckIcon(root, options = {}) {
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
