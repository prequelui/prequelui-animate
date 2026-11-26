import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "caret-left",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-caret-left",
  "family": "phosphor",
  "name": "caret-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createPhosphorCaretLeftIcon"
};

export function createPhosphorCaretLeftIcon(root, options = {}) {
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
