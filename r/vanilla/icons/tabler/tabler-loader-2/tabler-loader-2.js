import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "loader-2",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 3a9 9 0 1 0 9 9"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-loader-2",
  "family": "tabler",
  "name": "loader-2",
  "category": "Interface",
  "motion": "spin",
  "component": "createTablerLoader2Icon"
};

export function createTablerLoader2Icon(root, options = {}) {
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
