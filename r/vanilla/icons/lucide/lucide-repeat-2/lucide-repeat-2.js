import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "repeat-2",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m2 9 3-3 3 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 18H7a2 2 0 0 1-2-2V6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m22 15-3 3-3-3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 6h6a2 2 0 0 1 2 2v10"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-repeat-2",
  "family": "lucide",
  "name": "repeat-2",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createLucideRepeat2Icon"
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

export function createLucideRepeat2Icon(root, options = {}) {
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
