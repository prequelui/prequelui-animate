import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "x",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "close",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 6 6 18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m6 6 12 12"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-x",
  "family": "lucide",
  "name": "x",
  "category": "Interface",
  "motion": "close",
  "component": "createLucideXIcon"
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

export function createLucideXIcon(root, options = {}) {
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
