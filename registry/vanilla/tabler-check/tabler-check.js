import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "check",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "check",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l5 5l10 -10"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-check",
  "family": "tabler",
  "name": "check",
  "category": "Interface",
  "motion": "check",
  "component": "createTablerCheckIcon"
};

export function createTablerCheckIcon(root, options = {}) {
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
