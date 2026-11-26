import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "at",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-at",
  "family": "tabler",
  "name": "at",
  "category": "Communication",
  "motion": "chat",
  "component": "createTablerAtIcon"
};

export function createTablerAtIcon(root, options = {}) {
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
