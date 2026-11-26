import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "bell",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "ring",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 17v1a3 3 0 0 0 6 0v-1"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-bell",
  "family": "tabler",
  "name": "bell",
  "category": "Interface",
  "motion": "ring",
  "component": "createTablerBellIcon"
};

export function createTablerBellIcon(root, options = {}) {
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
