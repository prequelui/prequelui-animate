import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "archive-box",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "heroicons-archive-box",
  "family": "heroicons",
  "name": "archive-box",
  "category": "Files",
  "motion": "file",
  "component": "createHeroiconsArchiveBoxIcon"
};

export function createHeroiconsArchiveBoxIcon(root, options = {}) {
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
