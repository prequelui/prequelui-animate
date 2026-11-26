import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "file-plus",
  "category": "Files",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-file-plus",
  "family": "phosphor",
  "name": "file-plus",
  "category": "Files",
  "motion": "plus",
  "component": "createPhosphorFilePlusIcon"
};

export function createPhosphorFilePlusIcon(root, options = {}) {
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
