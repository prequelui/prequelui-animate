import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "info-circle",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 9h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 12h1v4h1"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-info-circle",
  "family": "tabler",
  "name": "info-circle",
  "category": "Interface",
  "motion": "pop",
  "component": "createTablerInfoCircleIcon"
};

export function createTablerInfoCircleIcon(root, options = {}) {
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
