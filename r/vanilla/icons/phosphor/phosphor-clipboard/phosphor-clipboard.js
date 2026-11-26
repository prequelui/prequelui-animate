import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "clipboard",
  "category": "Files",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "copy",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "phosphor-clipboard",
  "family": "phosphor",
  "name": "clipboard",
  "category": "Files",
  "motion": "copy",
  "component": "createPhosphorClipboardIcon"
};

export function createPhosphorClipboardIcon(root, options = {}) {
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
