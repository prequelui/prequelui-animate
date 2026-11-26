import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "add-01",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12.001 5.00003V19.002"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.002 12.002L4.99998 12.002"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-add-01",
  "family": "hugeicons",
  "name": "add-01",
  "category": "Interface",
  "motion": "plus",
  "component": "createHugeiconsAdd01Icon"
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

export function createHugeiconsAdd01Icon(root, options = {}) {
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
