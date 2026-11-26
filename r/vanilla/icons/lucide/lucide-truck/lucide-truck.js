import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "truck",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "float",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 18H9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "17",
        "cy": "18",
        "r": "2"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "7",
        "cy": "18",
        "r": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-truck",
  "family": "lucide",
  "name": "truck",
  "category": "Commerce",
  "motion": "float",
  "component": "createLucideTruckIcon"
};

export function createLucideTruckIcon(root, options = {}) {
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
