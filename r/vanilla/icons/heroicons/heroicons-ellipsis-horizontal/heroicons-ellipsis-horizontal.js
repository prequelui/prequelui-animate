import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "ellipsis-horizontal",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-ellipsis-horizontal",
  "family": "heroicons",
  "name": "ellipsis-horizontal",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createHeroiconsEllipsisHorizontalIcon"
};

export function createHeroiconsEllipsisHorizontalIcon(root, options = {}) {
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
