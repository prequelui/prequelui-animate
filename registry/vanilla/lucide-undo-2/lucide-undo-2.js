import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "undo-2",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9 14 4 9l5-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-undo-2",
  "family": "lucide",
  "name": "undo-2",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createLucideUndo2Icon"
};

export function createLucideUndo2Icon(root, options = {}) {
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
