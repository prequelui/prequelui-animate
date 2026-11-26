import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "minus",
  "category": "Interface",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-minus",
  "family": "phosphor",
  "name": "minus",
  "category": "Interface",
  "motion": "press",
  "component": "createPhosphorMinusIcon"
};

export function createPhosphorMinusIcon(root, options = {}) {
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
