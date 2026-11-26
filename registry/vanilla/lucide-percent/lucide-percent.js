import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "percent",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "circle",
      "attrs": {
        "cx": "6.5",
        "cy": "6.5",
        "r": "2.5"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "17.5",
        "cy": "17.5",
        "r": "2.5"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "19",
        "x2": "5",
        "y1": "5",
        "y2": "19"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-percent",
  "family": "lucide",
  "name": "percent",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucidePercentIcon"
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

export function createLucidePercentIcon(root, options = {}) {
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
