import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "refresh-ccw",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 3v5h5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 16h5v5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-refresh-ccw",
  "family": "lucide",
  "name": "refresh-ccw",
  "category": "Navigation",
  "motion": "spin",
  "component": "createLucideRefreshCcwIcon"
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

export function createLucideRefreshCcwIcon(root, options = {}) {
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
