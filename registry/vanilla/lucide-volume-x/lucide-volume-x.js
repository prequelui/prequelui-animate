import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "volume-x",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.5 14.5 5-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.5 9.5 5 5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-volume-x",
  "family": "lucide",
  "name": "volume-x",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideVolumeXIcon"
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

export function createLucideVolumeXIcon(root, options = {}) {
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
