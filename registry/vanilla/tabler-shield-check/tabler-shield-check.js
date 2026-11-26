import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "shield-check",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "check",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 19l2 2l4 -4"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-shield-check",
  "family": "tabler",
  "name": "shield-check",
  "category": "Status",
  "motion": "check",
  "component": "createTablerShieldCheckIcon"
};

export function createTablerShieldCheckIcon(root, options = {}) {
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
