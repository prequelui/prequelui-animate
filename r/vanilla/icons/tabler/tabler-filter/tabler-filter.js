import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "filter",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-filter",
  "family": "tabler",
  "name": "filter",
  "category": "Interface",
  "motion": "gear",
  "component": "createTablerFilterIcon"
};

export function createTablerFilterIcon(root, options = {}) {
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
