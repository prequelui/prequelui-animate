import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrows-exchange",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 10h14l-4 -4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 14h-14l4 4"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-arrows-exchange",
  "family": "tabler",
  "name": "arrows-exchange",
  "category": "Navigation",
  "motion": "sway",
  "component": "createTablerArrowsExchangeIcon"
};

export function createTablerArrowsExchangeIcon(root, options = {}) {
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
