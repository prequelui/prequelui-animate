import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "bars-4",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-bars-4",
  "family": "heroicons",
  "name": "bars-4",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createHeroiconsBars4Icon"
};

export function createHeroiconsBars4Icon(root, options = {}) {
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
