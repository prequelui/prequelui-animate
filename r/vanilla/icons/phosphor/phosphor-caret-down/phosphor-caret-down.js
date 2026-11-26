import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "caret-down",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-caret-down",
  "family": "phosphor",
  "name": "caret-down",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createPhosphorCaretDownIcon"
};

export function createPhosphorCaretDownIcon(root, options = {}) {
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
