import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "lock-open",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "lock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 11V7a5 5 0 0 1 9.9-1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "18",
        "height": "11",
        "x": "3",
        "y": "11",
        "rx": "2",
        "ry": "2"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-lock-open",
  "family": "lucide",
  "name": "lock-open",
  "category": "Status",
  "motion": "lock",
  "component": "createLucideLockOpenIcon"
};

export function createLucideLockOpenIcon(root, options = {}) {
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
