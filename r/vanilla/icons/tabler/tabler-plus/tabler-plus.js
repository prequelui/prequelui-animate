import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "plus",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 5l0 14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l14 0"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-plus",
  "family": "tabler",
  "name": "plus",
  "category": "Interface",
  "motion": "plus",
  "component": "createTablerPlusIcon"
};

export function createTablerPlusIcon(root, options = {}) {
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
