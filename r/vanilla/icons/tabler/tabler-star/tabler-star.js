import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "star",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "star",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-star",
  "family": "tabler",
  "name": "star",
  "category": "Status",
  "motion": "star",
  "component": "createTablerStarIcon"
};

export function createTablerStarIcon(root, options = {}) {
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
