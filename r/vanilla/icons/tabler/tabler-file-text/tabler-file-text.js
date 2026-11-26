import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "file-text",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M14 3v4a1 1 0 0 0 1 1h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 9l1 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 13l6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 17l6 0"
      }
    }
  ],
  "accents": [
    0,
    2,
    3,
    4
  ]
};

export const meta = {
  "slug": "tabler-file-text",
  "family": "tabler",
  "name": "file-text",
  "category": "Files",
  "motion": "file",
  "component": "createTablerFileTextIcon"
};

export function createTablerFileTextIcon(root, options = {}) {
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
