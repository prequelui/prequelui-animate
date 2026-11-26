import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "dots",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-dots",
  "family": "tabler",
  "name": "dots",
  "category": "Interface",
  "motion": "pop",
  "component": "createTablerDotsIcon"
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

export function createTablerDotsIcon(root, options = {}) {
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
