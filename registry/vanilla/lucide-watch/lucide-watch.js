import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "watch",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "clock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 10v2.2l1.6 1"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "6"
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
  "slug": "lucide-watch",
  "family": "lucide",
  "name": "watch",
  "category": "Media",
  "motion": "clock",
  "component": "createLucideWatchIcon"
};

export function createLucideWatchIcon(root, options = {}) {
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
