import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "rotate-clockwise",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-rotate-clockwise",
  "family": "tabler",
  "name": "rotate-clockwise",
  "category": "Navigation",
  "motion": "spin",
  "component": "createTablerRotateClockwiseIcon"
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

export function createTablerRotateClockwiseIcon(root, options = {}) {
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
