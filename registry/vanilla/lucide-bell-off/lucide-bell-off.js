import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "bell-off",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "ring",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10.268 21a2 2 0 0 0 3.464 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m2 2 20 20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-bell-off",
  "family": "lucide",
  "name": "bell-off",
  "category": "Interface",
  "motion": "ring",
  "component": "createLucideBellOffIcon"
};

export function createLucideBellOffIcon(root, options = {}) {
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
