import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "sliders-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 5H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 19H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 3v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 17v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 12h-9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 19h-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 5h-7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 10v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12H3"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ]
};

export const meta = {
  "slug": "lucide-sliders-horizontal",
  "family": "lucide",
  "name": "sliders-horizontal",
  "category": "Interface",
  "motion": "gear",
  "component": "createLucideSlidersHorizontalIcon"
};

export function createLucideSlidersHorizontalIcon(root, options = {}) {
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
