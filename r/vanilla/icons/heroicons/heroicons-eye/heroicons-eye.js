import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "eye",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "eye",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "heroicons-eye",
  "family": "heroicons",
  "name": "eye",
  "category": "Interface",
  "motion": "eye",
  "component": "createHeroiconsEyeIcon"
};

export function createHeroiconsEyeIcon(root, options = {}) {
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
