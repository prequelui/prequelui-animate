import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "alert-triangle",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 9v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 16h.01"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "tabler-alert-triangle",
  "family": "tabler",
  "name": "alert-triangle",
  "category": "Interface",
  "motion": "shake",
  "component": "createTablerAlertTriangleIcon"
};

export function createTablerAlertTriangleIcon(root, options = {}) {
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
