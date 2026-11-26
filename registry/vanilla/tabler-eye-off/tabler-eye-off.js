import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "eye-off",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "eye",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10.585 10.587a2 2 0 0 0 2.829 2.828"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 3l18 18"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "tabler-eye-off",
  "family": "tabler",
  "name": "eye-off",
  "category": "Interface",
  "motion": "eye",
  "component": "createTablerEyeOffIcon"
};

export function createTablerEyeOffIcon(root, options = {}) {
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
