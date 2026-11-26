import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "help-circle",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 16v.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-help-circle",
  "family": "tabler",
  "name": "help-circle",
  "category": "Interface",
  "motion": "pop",
  "component": "createTablerHelpCircleIcon"
};

export function createTablerHelpCircleIcon(root, options = {}) {
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
