import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "bell-ringing",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "ring",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 17v1a3 3 0 0 0 6 0v-1"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 6.727a11.05 11.05 0 0 0 -2.794 -3.727"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6.727a11.05 11.05 0 0 1 2.792 -3.727"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-bell-ringing",
  "family": "tabler",
  "name": "bell-ringing",
  "category": "Interface",
  "motion": "ring",
  "component": "createTablerBellRingingIcon"
};

export function createTablerBellRingingIcon(root, options = {}) {
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
