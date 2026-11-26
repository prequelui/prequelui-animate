import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevron-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideLeft",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15.75 19.5 8.25 12l7.5-7.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-chevron-left",
  "family": "heroicons",
  "name": "chevron-left",
  "category": "Navigation",
  "motion": "slideLeft",
  "component": "createHeroiconsChevronLeftIcon"
};

export function createHeroiconsChevronLeftIcon(root, options = {}) {
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
