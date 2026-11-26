import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "forward",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m15 17 5-5-5-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 18v-2a4 4 0 0 1 4-4h12"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-forward",
  "family": "lucide",
  "name": "forward",
  "category": "Communication",
  "motion": "chat",
  "component": "createLucideForwardIcon"
};

export function createLucideForwardIcon(root, options = {}) {
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
