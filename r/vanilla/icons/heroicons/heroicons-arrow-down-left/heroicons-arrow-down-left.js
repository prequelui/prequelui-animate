import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-arrow-down-left",
  "family": "heroicons",
  "name": "arrow-down-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createHeroiconsArrowDownLeftIcon"
};

export function createHeroiconsArrowDownLeftIcon(root, options = {}) {
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
