import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "share-2",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "orbit",
  "parts": [
    {
      "tag": "circle",
      "attrs": {
        "cx": "18",
        "cy": "5",
        "r": "3"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "6",
        "cy": "12",
        "r": "3"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "18",
        "cy": "19",
        "r": "3"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "8.59",
        "x2": "15.42",
        "y1": "13.51",
        "y2": "17.49"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "15.41",
        "x2": "8.59",
        "y1": "6.51",
        "y2": "10.49"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4
  ]
};

export const meta = {
  "slug": "lucide-share-2",
  "family": "lucide",
  "name": "share-2",
  "category": "Communication",
  "motion": "orbit",
  "component": "createLucideShare2Icon"
};

export function createLucideShare2Icon(root, options = {}) {
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
