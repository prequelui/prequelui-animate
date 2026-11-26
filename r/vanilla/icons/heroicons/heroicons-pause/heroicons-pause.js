import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "pause",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15.75 5.25v13.5m-7.5-13.5v13.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-pause",
  "family": "heroicons",
  "name": "pause",
  "category": "Media",
  "motion": "press",
  "component": "createHeroiconsPauseIcon"
};

export function createHeroiconsPauseIcon(root, options = {}) {
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
