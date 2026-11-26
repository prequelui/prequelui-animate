import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "volume-2",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 9a5 5 0 0 1 0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.364 18.364a9 9 0 0 0 0-12.728"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-volume-2",
  "family": "lucide",
  "name": "volume-2",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideVolume2Icon"
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

export function createLucideVolume2Icon(root, options = {}) {
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
