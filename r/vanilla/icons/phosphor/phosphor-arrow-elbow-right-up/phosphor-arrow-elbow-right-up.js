import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-elbow-right-up",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M221.66,101.66a8,8,0,0,1-11.32,0L176,67.31V192a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H160V67.31l-34.34,34.35a8,8,0,0,1-11.32-11.32l48-48a8,8,0,0,1,11.32,0l48,48A8,8,0,0,1,221.66,101.66Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-arrow-elbow-right-up",
  "family": "phosphor",
  "name": "arrow-elbow-right-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createPhosphorArrowElbowRightUpIcon"
};

export function createPhosphorArrowElbowRightUpIcon(root, options = {}) {
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
