import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "add-circle",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8V16M16 12H8"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-add-circle",
  "family": "hugeicons",
  "name": "add-circle",
  "category": "Interface",
  "motion": "plus",
  "component": "createHugeiconsAddCircleIcon"
};

export function createHugeiconsAddCircleIcon(root, options = {}) {
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
