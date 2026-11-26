import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "player-stop",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 7a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -10"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-player-stop",
  "family": "tabler",
  "name": "player-stop",
  "category": "Media",
  "motion": "press",
  "component": "createTablerPlayerStopIcon"
};

export function createTablerPlayerStopIcon(root, options = {}) {
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
