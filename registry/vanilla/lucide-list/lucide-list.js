import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "list",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 5h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 19h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 5h13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12h13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 19h13"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5
  ]
};

export const meta = {
  "slug": "lucide-list",
  "family": "lucide",
  "name": "list",
  "category": "Interface",
  "motion": "pop",
  "component": "createLucideListIcon"
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

export function createLucideListIcon(root, options = {}) {
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
