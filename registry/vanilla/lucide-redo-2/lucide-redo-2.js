import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "redo-2",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m15 14 5-5-5-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "lucide-redo-2",
  "family": "lucide",
  "name": "redo-2",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createLucideRedo2Icon"
};

export function createLucideRedo2Icon(root, options = {}) {
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
