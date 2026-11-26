import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevron-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m4.5 15.75 7.5-7.5 7.5 7.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-chevron-up",
  "family": "heroicons",
  "name": "chevron-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createHeroiconsChevronUpIcon"
};

export function createHeroiconsChevronUpIcon(root, options = {}) {
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
