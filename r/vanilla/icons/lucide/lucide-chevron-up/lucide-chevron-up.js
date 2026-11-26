import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "chevron-up",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m18 15-6-6-6 6"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-chevron-up",
  "family": "lucide",
  "name": "chevron-up",
  "category": "Navigation",
  "motion": "slideUp",
  "component": "createLucideChevronUpIcon"
};

export function createLucideChevronUpIcon(root, options = {}) {
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
