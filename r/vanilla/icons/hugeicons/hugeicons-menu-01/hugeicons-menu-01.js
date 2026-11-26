import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "menu-01",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 5L20 5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12L20 12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 19L20 19"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "hugeicons-menu-01",
  "family": "hugeicons",
  "name": "menu-01",
  "category": "Interface",
  "motion": "pop",
  "component": "createHugeiconsMenu01Icon"
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

export function createHugeiconsMenu01Icon(root, options = {}) {
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
