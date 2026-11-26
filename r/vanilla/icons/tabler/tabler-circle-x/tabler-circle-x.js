import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "circle-x",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "close",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 10l4 4m0 -4l-4 4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-circle-x",
  "family": "tabler",
  "name": "circle-x",
  "category": "Interface",
  "motion": "close",
  "component": "createTablerCircleXIcon"
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

export function createTablerCircleXIcon(root, options = {}) {
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
