import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "refresh",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-refresh",
  "family": "tabler",
  "name": "refresh",
  "category": "Navigation",
  "motion": "spin",
  "component": "createTablerRefreshIcon"
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

export function createTablerRefreshIcon(root, options = {}) {
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
