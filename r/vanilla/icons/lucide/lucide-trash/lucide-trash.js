import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "trash",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "trash",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 11v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6h18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      }
    }
  ],
  "accents": [
    0,
    1,
    3,
    4
  ]
};

export const meta = {
  "slug": "lucide-trash",
  "family": "lucide",
  "name": "trash",
  "category": "Files",
  "motion": "trash",
  "component": "createLucideTrashIcon"
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

export function createLucideTrashIcon(root, options = {}) {
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
