import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "at-symbol",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "heroicons-at-symbol",
  "family": "heroicons",
  "name": "at-symbol",
  "category": "Communication",
  "motion": "chat",
  "component": "createHeroiconsAtSymbolIcon"
};

export function createHeroiconsAtSymbolIcon(root, options = {}) {
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
