import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "ellipsis",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "1"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "19",
        "cy": "12",
        "r": "1"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "5",
        "cy": "12",
        "r": "1"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "lucide-ellipsis",
  "family": "lucide",
  "name": "ellipsis",
  "category": "Interface",
  "motion": "pop",
  "component": "createLucideEllipsisIcon"
};

export function createLucideEllipsisIcon(root, options = {}) {
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
