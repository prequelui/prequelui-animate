import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "basket",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5.001 8h13.999a2 2 0 0 1 1.977 2.304l-1.255 7.152a3 3 0 0 1 -2.966 2.544h-9.512a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 10l-2 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 10l2 -6"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-basket",
  "family": "tabler",
  "name": "basket",
  "category": "Commerce",
  "motion": "bounce",
  "component": "createTablerBasketIcon"
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

export function createTablerBasketIcon(root, options = {}) {
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
