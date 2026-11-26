import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "adjustments-vertical",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "heroicons-adjustments-vertical",
  "family": "heroicons",
  "name": "adjustments-vertical",
  "category": "Interface",
  "motion": "gear",
  "component": "createHeroiconsAdjustmentsVerticalIcon"
};

export function createHeroiconsAdjustmentsVerticalIcon(root, options = {}) {
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
