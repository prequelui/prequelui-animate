import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevron-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6l-6 6l6 6"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-chevron-left",
  "family": "tabler",
  "name": "chevron-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createTablerChevronLeftIcon"
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

export function createTablerChevronLeftIcon(root, options = {}) {
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
