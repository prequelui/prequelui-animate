import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "key",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "lock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m2 21 9.6-9.6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "15.5",
        "cy": "7.5",
        "r": "5.5"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "lucide-key",
  "family": "lucide",
  "name": "key",
  "category": "Status",
  "motion": "lock",
  "component": "createLucideKeyIcon"
};

export function createLucideKeyIcon(root, options = {}) {
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
