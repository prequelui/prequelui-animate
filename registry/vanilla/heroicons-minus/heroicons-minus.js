import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "minus",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12h14"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-minus",
  "family": "heroicons",
  "name": "minus",
  "category": "Navigation",
  "motion": "press",
  "component": "createHeroiconsMinusIcon"
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

export function createHeroiconsMinusIcon(root, options = {}) {
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
