import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "tv",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m17 2-5 5-5-5"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "20",
        "height": "15",
        "x": "2",
        "y": "7",
        "rx": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-tv",
  "family": "lucide",
  "name": "tv",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideTvIcon"
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

export function createLucideTvIcon(root, options = {}) {
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
