import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-up-right",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-arrow-up-right",
  "family": "phosphor",
  "name": "arrow-up-right",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createPhosphorArrowUpRightIcon"
};

export function createPhosphorArrowUpRightIcon(root, options = {}) {
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
