import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "check",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "check",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m4.5 12.75 6 6 9-13.5"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "heroicons-check",
  "family": "heroicons",
  "name": "check",
  "category": "Navigation",
  "motion": "check",
  "component": "createHeroiconsCheckIcon"
};

export function createHeroiconsCheckIcon(root, options = {}) {
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
