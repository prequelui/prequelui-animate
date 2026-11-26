import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "truck",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "float",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-truck",
  "family": "tabler",
  "name": "truck",
  "category": "Commerce",
  "motion": "float",
  "component": "createTablerTruckIcon"
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

export function createTablerTruckIcon(root, options = {}) {
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
