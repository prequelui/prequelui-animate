import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "file-download",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "drop",
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
        "d": "M12 17v-6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9.5 14.5l2.5 2.5l2.5 -2.5"
      }
    }
  ],
  "accents": [
    2
  ]
};

export const meta = {
  "slug": "tabler-file-download",
  "family": "tabler",
  "name": "file-download",
  "category": "Files",
  "motion": "drop",
  "component": "createTablerFileDownloadIcon"
};

export function createTablerFileDownloadIcon(root, options = {}) {
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
