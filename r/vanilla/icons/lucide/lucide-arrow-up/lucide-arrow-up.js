import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m5 12 7-7 7 7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 19V5"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-arrow-up",
  "family": "lucide",
  "name": "arrow-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createLucideArrowUpIcon"
};

export function createLucideArrowUpIcon(root, options = {}) {
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
