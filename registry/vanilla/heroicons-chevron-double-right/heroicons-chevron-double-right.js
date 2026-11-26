import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevron-double-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-chevron-double-right",
  "family": "heroicons",
  "name": "chevron-double-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createHeroiconsChevronDoubleRightIcon"
};

export function createHeroiconsChevronDoubleRightIcon(root, options = {}) {
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
