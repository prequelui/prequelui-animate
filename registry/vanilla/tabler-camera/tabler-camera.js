import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "camera",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-camera",
  "family": "tabler",
  "name": "camera",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerCameraIcon"
};

export function createTablerCameraIcon(root, options = {}) {
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
