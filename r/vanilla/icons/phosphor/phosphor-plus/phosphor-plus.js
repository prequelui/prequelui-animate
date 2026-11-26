import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "plus",
  "category": "Interface",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-plus",
  "family": "phosphor",
  "name": "plus",
  "category": "Interface",
  "motion": "plus",
  "component": "createPhosphorPlusIcon"
};

export function createPhosphorPlusIcon(root, options = {}) {
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
