import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "smartphone",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18h.01"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "6",
        "y": "2",
        "width": "12",
        "height": "20",
        "rx": "2",
        "ry": "2"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-smartphone",
  "family": "lucide",
  "name": "smartphone",
  "category": "Media",
  "motion": "shake",
  "component": "createLucideSmartphoneIcon"
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

export function createLucideSmartphoneIcon(root, options = {}) {
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
