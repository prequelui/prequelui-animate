import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-autofit-right",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12v-6a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 18h17"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 15l3 3l-3 3"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-arrow-autofit-right",
  "family": "tabler",
  "name": "arrow-autofit-right",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createTablerArrowAutofitRightIcon"
};

export function createTablerArrowAutofitRightIcon(root, options = {}) {
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
