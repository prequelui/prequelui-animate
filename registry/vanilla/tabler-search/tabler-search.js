import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "search",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "focus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 21l-6 -6"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-search",
  "family": "tabler",
  "name": "search",
  "category": "Interface",
  "motion": "focus",
  "component": "createTablerSearchIcon"
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

export function createTablerSearchIcon(root, options = {}) {
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
