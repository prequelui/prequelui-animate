import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "table",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 10h18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 3v18"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-table",
  "family": "tabler",
  "name": "table",
  "category": "Interface",
  "motion": "pop",
  "component": "createTablerTableIcon"
};

export function createTablerTableIcon(root, options = {}) {
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
