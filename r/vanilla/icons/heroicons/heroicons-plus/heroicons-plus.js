import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "plus",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "plus",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 4.5v15m7.5-7.5h-15"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-plus",
  "family": "heroicons",
  "name": "plus",
  "category": "Navigation",
  "motion": "plus",
  "component": "createHeroiconsPlusIcon"
};

export function createHeroiconsPlusIcon(root, options = {}) {
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
