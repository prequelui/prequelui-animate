import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-up-down",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 4V20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 19L17 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 6.99998C10 6.99998 7.79053 4.00001 6.99998 4C6.20942 3.99999 4 7 4 7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 17C20 17 17.7905 20 17 20C16.2094 20 14 17 14 17"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "hugeicons-arrow-up-down",
  "family": "hugeicons",
  "name": "arrow-up-down",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createHugeiconsArrowUpDownIcon"
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

export function createHugeiconsArrowUpDownIcon(root, options = {}) {
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
