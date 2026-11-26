import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "layout-grid",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "3",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "14",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "14",
        "rx": "1"
      }
    }
  ],
  "accents": [
    1,
    2,
    3
  ]
};

export const meta = {
  "slug": "lucide-layout-grid",
  "family": "lucide",
  "name": "layout-grid",
  "category": "Interface",
  "motion": "pop",
  "component": "createLucideLayoutGridIcon"
};

export function createLucideLayoutGridIcon(root, options = {}) {
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
