import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "power",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "charge",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 2v10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18.4 6.6a9 9 0 1 1-12.77.04"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-power",
  "family": "lucide",
  "name": "power",
  "category": "Interface",
  "motion": "charge",
  "component": "createLucidePowerIcon"
};

export function createLucidePowerIcon(root, options = {}) {
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
