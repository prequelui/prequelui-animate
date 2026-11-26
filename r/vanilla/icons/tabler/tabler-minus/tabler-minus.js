import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "minus",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l14 0"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-minus",
  "family": "tabler",
  "name": "minus",
  "category": "Interface",
  "motion": "press",
  "component": "createTablerMinusIcon"
};

export function createTablerMinusIcon(root, options = {}) {
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
