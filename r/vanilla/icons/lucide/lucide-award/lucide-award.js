import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "award",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "8",
        "r": "6"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-award",
  "family": "lucide",
  "name": "award",
  "category": "Status",
  "motion": "shake",
  "component": "createLucideAwardIcon"
};

export function createLucideAwardIcon(root, options = {}) {
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
