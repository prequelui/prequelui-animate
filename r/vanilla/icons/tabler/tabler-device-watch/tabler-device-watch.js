import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "device-watch",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "clock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 9a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3v-6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 18v3h6v-3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 6v-3h6v3"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-device-watch",
  "family": "tabler",
  "name": "device-watch",
  "category": "Media",
  "motion": "clock",
  "component": "createTablerDeviceWatchIcon"
};

export function createTablerDeviceWatchIcon(root, options = {}) {
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
