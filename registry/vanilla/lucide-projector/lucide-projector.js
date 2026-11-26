import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "projector",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 7 3 5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 6V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m13 7 2-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 16h2"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "9",
        "cy": "13",
        "r": "3"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-projector",
  "family": "lucide",
  "name": "projector",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideProjectorIcon"
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

export function createLucideProjectorIcon(root, options = {}) {
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
