import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "database",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6v6a8 3 0 0 0 16 0v-6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12v6a8 3 0 0 0 16 0v-6"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-database",
  "family": "tabler",
  "name": "database",
  "category": "Files",
  "motion": "file",
  "component": "createTablerDatabaseIcon"
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

export function createTablerDatabaseIcon(root, options = {}) {
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
