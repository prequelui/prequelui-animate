import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "repeat",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-repeat",
  "family": "tabler",
  "name": "repeat",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createTablerRepeatIcon"
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

export function createTablerRepeatIcon(root, options = {}) {
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
