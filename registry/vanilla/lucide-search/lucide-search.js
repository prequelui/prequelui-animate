import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "search",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "focus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m21 21-4.34-4.34"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "11",
        "cy": "11",
        "r": "8"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-search",
  "family": "lucide",
  "name": "search",
  "category": "Interface",
  "motion": "focus",
  "component": "createLucideSearchIcon"
};

export function createLucideSearchIcon(root, options = {}) {
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
