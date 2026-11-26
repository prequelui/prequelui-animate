import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "circle-x",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "close",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m15 9-6 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m9 9 6 6"
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
  "accents": []
};

export const meta = {
  "slug": "lucide-circle-x",
  "family": "lucide",
  "name": "circle-x",
  "category": "Interface",
  "motion": "close",
  "component": "createLucideCircleXIcon"
};

export function createLucideCircleXIcon(root, options = {}) {
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
