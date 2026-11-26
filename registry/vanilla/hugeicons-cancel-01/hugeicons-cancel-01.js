import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "cancel-01",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "close",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 6L6.00081 17.9992M17.9992 18L6 6.00085"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-cancel-01",
  "family": "hugeicons",
  "name": "cancel-01",
  "category": "Interface",
  "motion": "close",
  "component": "createHugeiconsCancel01Icon"
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

export function createHugeiconsCancel01Icon(root, options = {}) {
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
