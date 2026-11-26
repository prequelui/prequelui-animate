import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "circle-check",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "check",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m16 9-5.5 5.5L8 12"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-circle-check",
  "family": "lucide",
  "name": "circle-check",
  "category": "Interface",
  "motion": "check",
  "component": "createLucideCircleCheckIcon"
};

export function createLucideCircleCheckIcon(root, options = {}) {
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
