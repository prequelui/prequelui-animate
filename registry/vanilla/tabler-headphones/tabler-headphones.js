import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "headphones",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 15a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2l0 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 15a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2l0 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 15v-3a8 8 0 0 1 16 0v3"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "tabler-headphones",
  "family": "tabler",
  "name": "headphones",
  "category": "Media",
  "motion": "shake",
  "component": "createTablerHeadphonesIcon"
};

export function createTablerHeadphonesIcon(root, options = {}) {
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
