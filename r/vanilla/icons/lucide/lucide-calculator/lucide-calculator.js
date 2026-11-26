import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "calculator",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 14h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 14h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 18h.01"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "8",
        "x2": "16",
        "y1": "6",
        "y2": "6"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "16",
        "x2": "16",
        "y1": "14",
        "y2": "18"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-calculator",
  "family": "lucide",
  "name": "calculator",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucideCalculatorIcon"
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

export function createLucideCalculatorIcon(root, options = {}) {
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
