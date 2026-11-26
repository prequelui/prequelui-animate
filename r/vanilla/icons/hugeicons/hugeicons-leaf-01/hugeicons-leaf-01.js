import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "leaf-01",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7.64584 15.7108C7.23279 14.8966 7 13.9755 7 13C7 9.78484 9.5 7.5 13 7C17.0817 6.4169 18.8333 4.16667 20 3C23.5 16 17 19 13 19C11.9071 19 10.8825 18.7078 10 18.1973"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 21C3.5 18 5.45791 16.1355 10 15C13.2167 14.1958 15.4634 12.1791 17 10.0549"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-leaf-01",
  "family": "hugeicons",
  "name": "leaf-01",
  "category": "Status",
  "motion": "shake",
  "component": "createHugeiconsLeaf01Icon"
};

export function createHugeiconsLeaf01Icon(root, options = {}) {
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
