import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down-left",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-arrow-down-left",
  "family": "phosphor",
  "name": "arrow-down-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createPhosphorArrowDownLeftIcon"
};

export function createPhosphorArrowDownLeftIcon(root, options = {}) {
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
