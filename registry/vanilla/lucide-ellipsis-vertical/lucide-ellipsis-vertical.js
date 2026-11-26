import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "ellipsis-vertical",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "1"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "5",
        "r": "1"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "19",
        "r": "1"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "lucide-ellipsis-vertical",
  "family": "lucide",
  "name": "ellipsis-vertical",
  "category": "Interface",
  "motion": "pop",
  "component": "createLucideEllipsisVerticalIcon"
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

export function createLucideEllipsisVerticalIcon(root, options = {}) {
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
