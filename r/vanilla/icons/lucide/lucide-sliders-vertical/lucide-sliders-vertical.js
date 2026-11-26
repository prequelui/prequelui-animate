import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "sliders-vertical",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 8h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 21v-9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 16h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 12V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 21v-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 14h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 10V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 21v-7"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ]
};

export const meta = {
  "slug": "lucide-sliders-vertical",
  "family": "lucide",
  "name": "sliders-vertical",
  "category": "Interface",
  "motion": "gear",
  "component": "createLucideSlidersVerticalIcon"
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

export function createLucideSlidersVerticalIcon(root, options = {}) {
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
