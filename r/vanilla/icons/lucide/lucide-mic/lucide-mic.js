import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "mic",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 19v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 10v2a7 7 0 0 1-14 0v-2"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "9",
        "y": "2",
        "width": "6",
        "height": "13",
        "rx": "3"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-mic",
  "family": "lucide",
  "name": "mic",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideMicIcon"
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

export function createLucideMicIcon(root, options = {}) {
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
