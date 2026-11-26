import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "corner-down-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20 4v7a4 4 0 0 1-4 4H4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m9 10-5 5 5 5"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-corner-down-left",
  "family": "lucide",
  "name": "corner-down-left",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createLucideCornerDownLeftIcon"
};

export function createLucideCornerDownLeftIcon(root, options = {}) {
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
