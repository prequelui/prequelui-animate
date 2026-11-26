import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "volume-3",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 10l4 4m0 -4l-4 4"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-volume-3",
  "family": "tabler",
  "name": "volume-3",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerVolume3Icon"
};

export function createTablerVolume3Icon(root, options = {}) {
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
