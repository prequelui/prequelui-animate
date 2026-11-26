import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "plus",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12h14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 5v14"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-plus",
  "family": "lucide",
  "name": "plus",
  "category": "Interface",
  "motion": "plus",
  "component": "createLucidePlusIcon"
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

export function createLucidePlusIcon(root, options = {}) {
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
