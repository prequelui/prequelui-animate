import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "bookmark-simple",
  "category": "Status",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "bookmark",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-bookmark-simple",
  "family": "phosphor",
  "name": "bookmark-simple",
  "category": "Status",
  "motion": "bookmark",
  "component": "createPhosphorBookmarkSimpleIcon"
};

export function createPhosphorBookmarkSimpleIcon(root, options = {}) {
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
