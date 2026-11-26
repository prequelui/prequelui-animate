import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "folder-plus",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-folder-plus",
  "family": "heroicons",
  "name": "folder-plus",
  "category": "Files",
  "motion": "plus",
  "component": "createHeroiconsFolderPlusIcon"
};

export function createHeroiconsFolderPlusIcon(root, options = {}) {
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
