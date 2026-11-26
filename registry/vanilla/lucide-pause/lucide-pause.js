import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "pause",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
  "parts": [
    {
      "tag": "rect",
      "attrs": {
        "x": "14",
        "y": "3",
        "width": "5",
        "height": "18",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "5",
        "y": "3",
        "width": "5",
        "height": "18",
        "rx": "1"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-pause",
  "family": "lucide",
  "name": "pause",
  "category": "Media",
  "motion": "press",
  "component": "createLucidePauseIcon"
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

export function createLucidePauseIcon(root, options = {}) {
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
