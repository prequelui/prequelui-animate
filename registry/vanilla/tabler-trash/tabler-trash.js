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
        "d": "M4 7l16 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11l0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 11l0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    4
  ]
};

export const meta = {
  "slug": "tabler-trash",
  "family": "tabler",
  "name": "trash",
  "category": "Files",
  "motion": "trash",
  "component": "createTablerTrashIcon"
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

export function createTablerTrashIcon(root, options = {}) {
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
