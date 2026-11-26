import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-turn-down",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5.99994 13L5.99994 8.5C5.99994 6.01472 8.01466 4 10.4999 4C12.9852 4 14.9999 6.01472 14.9999 8.5V20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9999 17C11.9999 17 14.2093 20 14.9999 20C15.7905 20 17.9999 17 17.9999 17"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-arrow-turn-down",
  "family": "hugeicons",
  "name": "arrow-turn-down",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createHugeiconsArrowTurnDownIcon"
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

export function createHugeiconsArrowTurnDownIcon(root, options = {}) {
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
