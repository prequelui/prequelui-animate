import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "gift",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20.625 11.505v8.25a1.5 1.5 0 0 1-1.5 1.5H4.875a1.5 1.5 0 0 1-1.5-1.5v-8.25m8.25-6.375A2.625 2.625 0 1 0 9 7.755h2.625m0-2.625v2.625m0-2.625a2.625 2.625 0 1 1 2.625 2.625h-2.625m0 0v13.5M3 11.505h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.622-.504-1.125-1.125-1.125H3c-.621 0-1.125.503-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-gift",
  "family": "heroicons",
  "name": "gift",
  "category": "Commerce",
  "motion": "coin",
  "component": "createHeroiconsGiftIcon"
};

export function createHeroiconsGiftIcon(root, options = {}) {
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
