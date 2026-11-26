import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "shuffle",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m18 14 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m18 2 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 6h1.972a4 4 0 0 1 3.6 2.2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"
      }
    }
  ],
  "accents": [
    0,
    1,
    3,
    4
  ]
};

export const meta = {
  "slug": "lucide-shuffle",
  "family": "lucide",
  "name": "shuffle",
  "category": "Navigation",
  "motion": "sway",
  "component": "createLucideShuffleIcon"
};

export function createLucideShuffleIcon(root, options = {}) {
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
