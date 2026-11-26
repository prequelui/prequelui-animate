import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "rss",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "signal",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 4a16 16 0 0 1 16 16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 11a9 9 0 0 1 9 9"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "tabler-rss",
  "family": "tabler",
  "name": "rss",
  "category": "Communication",
  "motion": "signal",
  "component": "createTablerRssIcon"
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

export function createTablerRssIcon(root, options = {}) {
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
