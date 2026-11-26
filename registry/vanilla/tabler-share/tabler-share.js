import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "share",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.7 10.7l6.6 -3.4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.7 13.3l6.6 3.4"
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
  "slug": "tabler-share",
  "family": "tabler",
  "name": "share",
  "category": "Communication",
  "motion": "orbit",
  "component": "createTablerShareIcon"
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

export function createTablerShareIcon(root, options = {}) {
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
