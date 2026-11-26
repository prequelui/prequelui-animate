import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "repeat",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m17 2 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 11v-1a4 4 0 0 1 4-4h14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7 22-4-4 4-4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 13v1a4 4 0 0 1-4 4H3"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-repeat",
  "family": "lucide",
  "name": "repeat",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createLucideRepeatIcon"
};

export function createLucideRepeatIcon(root, options = {}) {
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
