import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "folder-plus",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 19h6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 16v6"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-folder-plus",
  "family": "tabler",
  "name": "folder-plus",
  "category": "Files",
  "motion": "plus",
  "component": "createTablerFolderPlusIcon"
};

export function createTablerFolderPlusIcon(root, options = {}) {
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
