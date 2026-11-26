import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "caret-right",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-caret-right",
  "family": "phosphor",
  "name": "caret-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createPhosphorCaretRightIcon"
};

export function createPhosphorCaretRightIcon(root, options = {}) {
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
