import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M17 7l-10 10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 17l-9 0l0 -9"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-arrow-down-left",
  "family": "tabler",
  "name": "arrow-down-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createTablerArrowDownLeftIcon"
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

export function createTablerArrowDownLeftIcon(root, options = {}) {
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
