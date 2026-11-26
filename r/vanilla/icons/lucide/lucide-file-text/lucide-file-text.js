import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "file-text",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 2v5a1 1 0 0 0 1 1h5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 9H8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 13H8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 17H8"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4
  ]
};

export const meta = {
  "slug": "lucide-file-text",
  "family": "lucide",
  "name": "file-text",
  "category": "Files",
  "motion": "file",
  "component": "createLucideFileTextIcon"
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

export function createLucideFileTextIcon(root, options = {}) {
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
