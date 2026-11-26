import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "shield",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shield",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-shield",
  "family": "tabler",
  "name": "shield",
  "category": "Status",
  "motion": "shield",
  "component": "createTablerShieldIcon"
};

export function createTablerShieldIcon(root, options = {}) {
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
