import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "list",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9 6l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 12l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 18l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 6l0 .01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l0 .01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 18l0 .01"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5
  ]
};

export const meta = {
  "slug": "tabler-list",
  "family": "tabler",
  "name": "list",
  "category": "Interface",
  "motion": "pop",
  "component": "createTablerListIcon"
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

export function createTablerListIcon(root, options = {}) {
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
