import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "device-desktop",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 20h10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 16v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 16v4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-device-desktop",
  "family": "tabler",
  "name": "device-desktop",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerDeviceDesktopIcon"
};

export function createTablerDeviceDesktopIcon(root, options = {}) {
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
