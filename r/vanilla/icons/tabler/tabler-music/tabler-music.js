import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "music",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 17v-13h10v13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 8h10"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-music",
  "family": "tabler",
  "name": "music",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerMusicIcon"
};

export function createTablerMusicIcon(root, options = {}) {
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
