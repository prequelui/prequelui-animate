import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "broadcast",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "signal",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18.364 19.364a9 9 0 1 0 -12.728 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.536 16.536a5 5 0 1 0 -7.072 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 13a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-broadcast",
  "family": "tabler",
  "name": "broadcast",
  "category": "Communication",
  "motion": "signal",
  "component": "createTablerBroadcastIcon"
};

export function createTablerBroadcastIcon(root, options = {}) {
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
