import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "save",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 3v4a1 1 0 0 0 1 1h7"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "lucide-save",
  "family": "lucide",
  "name": "save",
  "category": "Files",
  "motion": "file",
  "component": "createLucideSaveIcon"
};

export function createLucideSaveIcon(root, options = {}) {
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
