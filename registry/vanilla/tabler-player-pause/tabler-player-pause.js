import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "player-pause",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-player-pause",
  "family": "tabler",
  "name": "player-pause",
  "category": "Media",
  "motion": "press",
  "component": "createTablerPlayerPauseIcon"
};

export function createTablerPlayerPauseIcon(root, options = {}) {
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
