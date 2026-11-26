import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "paperclip",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-paperclip",
  "family": "tabler",
  "name": "paperclip",
  "category": "Files",
  "motion": "file",
  "component": "createTablerPaperclipIcon"
};

export function createTablerPaperclipIcon(root, options = {}) {
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
