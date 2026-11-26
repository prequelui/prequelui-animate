import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrows-shuffle",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 4l3 3l-3 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 20l3 -3l-3 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-arrows-shuffle",
  "family": "tabler",
  "name": "arrows-shuffle",
  "category": "Navigation",
  "motion": "sway",
  "component": "createTablerArrowsShuffleIcon"
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

export function createTablerArrowsShuffleIcon(root, options = {}) {
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
