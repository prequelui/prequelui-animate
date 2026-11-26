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
        "d": "M12 2v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.2 7.8 2.9-2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.2 16.2 2.9 2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.9 19.1 2.9-2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 12h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.9 4.9 2.9 2.9"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-loader",
  "family": "lucide",
  "name": "loader",
  "category": "Interface",
  "motion": "spin",
  "component": "createLucideLoaderIcon"
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

export function createLucideLoaderIcon(root, options = {}) {
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
