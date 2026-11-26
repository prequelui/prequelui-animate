import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "mail",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "mail",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "2",
        "y": "4",
        "width": "20",
        "height": "16",
        "rx": "2"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-mail",
  "family": "lucide",
  "name": "mail",
  "category": "Communication",
  "motion": "mail",
  "component": "createLucideMailIcon"
};

export function createLucideMailIcon(root, options = {}) {
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
