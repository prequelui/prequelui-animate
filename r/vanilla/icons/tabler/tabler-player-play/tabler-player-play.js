import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "player-play",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 4v16l13 -8l-13 -8"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-player-play",
  "family": "tabler",
  "name": "player-play",
  "category": "Media",
  "motion": "press",
  "component": "createTablerPlayerPlayIcon"
};

export function createTablerPlayerPlayIcon(root, options = {}) {
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
