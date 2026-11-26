import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "loader",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 6l0 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.25 7.75l2.15 -2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12l3 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.25 16.25l2.15 2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18l0 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.75 16.25l-2.15 2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12l-3 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.75 7.75l-2.15 -2.15"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-loader",
  "family": "tabler",
  "name": "loader",
  "category": "Interface",
  "motion": "spin",
  "component": "createTablerLoaderIcon"
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

export function createTablerLoaderIcon(root, options = {}) {
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
