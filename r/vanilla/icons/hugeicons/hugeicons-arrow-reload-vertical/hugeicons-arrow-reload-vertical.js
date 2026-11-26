import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-reload-vertical",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5.5 3.5L5.5 14.5C5.5 18.2133 8.18503 21 12 21"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18.5 20.5L18.5 9.5C18.5 5.78672 15.815 3 12 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 18C21 18 19.1588 20.5 18.5 20.5C17.8412 20.5 16 18 16 18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 5.50022C8 5.50022 6.15878 3.00025 5.49998 3.00024C4.84118 3.00024 3 5.50024 3 5.50024"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-arrow-reload-vertical",
  "family": "hugeicons",
  "name": "arrow-reload-vertical",
  "category": "Navigation",
  "motion": "spin",
  "component": "createHugeiconsArrowReloadVerticalIcon"
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

export function createHugeiconsArrowReloadVerticalIcon(root, options = {}) {
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
