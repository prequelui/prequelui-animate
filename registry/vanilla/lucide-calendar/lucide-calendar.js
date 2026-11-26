import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "calendar",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "flip",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8 2v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 2v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 9h18"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "3",
        "y": "3",
        "width": "18",
        "height": "18",
        "rx": "2"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
  ]
};

export const meta = {
  "slug": "lucide-calendar",
  "family": "lucide",
  "name": "calendar",
  "category": "Interface",
  "motion": "flip",
  "component": "createLucideCalendarIcon"
};

export function createLucideCalendarIcon(root, options = {}) {
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
