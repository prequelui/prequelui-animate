import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "arrow-down",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 5v14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m19 12-7 7-7-7"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-arrow-down",
  "family": "lucide",
  "name": "arrow-down",
  "category": "Navigation",
  "motion": "slideDown",
  "component": "createLucideArrowDownIcon"
};

export function createLucideArrowDownIcon(root, options = {}) {
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
