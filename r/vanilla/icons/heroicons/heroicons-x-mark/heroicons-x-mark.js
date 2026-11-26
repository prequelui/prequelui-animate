import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "x-mark",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "close",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 18 18 6M6 6l12 12"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-x-mark",
  "family": "heroicons",
  "name": "x-mark",
  "category": "Navigation",
  "motion": "close",
  "component": "createHeroiconsXMarkIcon"
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

export function createHeroiconsXMarkIcon(root, options = {}) {
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
