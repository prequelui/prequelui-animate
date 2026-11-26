import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "box",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "float",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l0 9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l-8 -4.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-box",
  "family": "tabler",
  "name": "box",
  "category": "Files",
  "motion": "float",
  "component": "createTablerBoxIcon"
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

export function createTablerBoxIcon(root, options = {}) {
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
