import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "clock-01",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "lock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8V12L14 14"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "hugeicons-clock-01",
  "family": "hugeicons",
  "name": "clock-01",
  "category": "Interface",
  "motion": "lock",
  "component": "createHugeiconsClock01Icon"
};

export function createHugeiconsClock01Icon(root, options = {}) {
  let current = { ...options };
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
