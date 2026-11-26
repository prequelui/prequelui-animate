import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "gift",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 7v14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "3",
        "y": "7",
        "width": "18",
        "height": "4",
        "rx": "1"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-gift",
  "family": "lucide",
  "name": "gift",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucideGiftIcon"
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

export function createLucideGiftIcon(root, options = {}) {
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
