import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-arrow-up",
  "family": "heroicons",
  "name": "arrow-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createHeroiconsArrowUpIcon"
};

export function createHeroiconsArrowUpIcon(root, options = {}) {
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
