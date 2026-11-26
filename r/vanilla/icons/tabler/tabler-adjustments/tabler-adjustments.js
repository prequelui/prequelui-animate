import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "adjustments",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 4v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12v8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 4v10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 4v1"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 9v11"
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
  "slug": "tabler-adjustments",
  "family": "tabler",
  "name": "adjustments",
  "category": "Interface",
  "motion": "gear",
  "component": "createTablerAdjustmentsIcon"
};

export const defaults = {
  size: 28,
  className: "",
  label: "",
  speed: 1,
  delay: 0,
  loop: false,
  animate: false,
  animateOnHover: true,
  animateOnTap: true,
  animateOnView: false,
  animateOnViewOnce: true,
  animation: "hover",
};

export function createTablerAdjustmentsIcon(root, options = {}) {
  let current = { ...defaults, ...options };
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
