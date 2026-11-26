import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "sun",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sun",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 2v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 20v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.93 4.93 1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m17.66 17.66 1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 12h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m6.34 17.66-1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m19.07 4.93-1.41 1.41"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "4"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ]
};

export const meta = {
  "slug": "lucide-sun",
  "family": "lucide",
  "name": "sun",
  "category": "Status",
  "motion": "sun",
  "component": "createLucideSunIcon"
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

export function createLucideSunIcon(root, options = {}) {
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
