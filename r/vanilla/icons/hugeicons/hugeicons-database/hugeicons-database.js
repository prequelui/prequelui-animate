import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "database",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 10.842C7.60158 11.0229 8.27434 11.1718 9 11.282"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12C20 13.6569 16.4183 15 12 15C7.58172 15 4 13.6569 4 12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 17.842C7.60158 18.0229 8.27434 18.1718 9 18.282"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 5V19C20 20.6569 16.4183 22 12 22C7.58172 22 4 20.6569 4 19V5"
      }
    },
    {
      "tag": "ellipse",
      "attrs": {
        "cx": "12",
        "cy": "5",
        "rx": "8",
        "ry": "3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3
  ]
};

export const meta = {
  "slug": "hugeicons-database",
  "family": "hugeicons",
  "name": "database",
  "category": "Files",
  "motion": "file",
  "component": "createHugeiconsDatabaseIcon"
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

export function createHugeiconsDatabaseIcon(root, options = {}) {
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
