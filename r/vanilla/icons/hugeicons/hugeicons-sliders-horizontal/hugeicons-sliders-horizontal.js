import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "sliders-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 5.00055L9.99963 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.9996 5.00031L19.9996 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 9.00031L15.9996 15.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9.99963 2.00031L9.99963 8.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 16.0003L11.9996 22.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 12.0001L19.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 12.0005L12.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 19.0003L19.9996 19.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 19.0005L8.99963 19.0003"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4,
    5,
    7,
    8
  ]
};

export const meta = {
  "slug": "hugeicons-sliders-horizontal",
  "family": "hugeicons",
  "name": "sliders-horizontal",
  "category": "Interface",
  "motion": "gear",
  "component": "createHugeiconsSlidersHorizontalIcon"
};

export function createHugeiconsSlidersHorizontalIcon(root, options = {}) {
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
