import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "archive",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 12l4 0"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "tabler-archive",
  "family": "tabler",
  "name": "archive",
  "category": "Files",
  "motion": "file",
  "component": "createTablerArchiveIcon"
};

export function createTablerArchiveIcon(root, options = {}) {
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
