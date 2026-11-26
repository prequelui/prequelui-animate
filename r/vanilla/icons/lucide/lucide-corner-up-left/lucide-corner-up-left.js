import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "corner-up-left",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "slideRight",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20 20v-7a4 4 0 0 0-4-4H4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 14 4 9l5-5"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-corner-up-left",
  "family": "lucide",
  "name": "corner-up-left",
  "category": "Navigation",
  "motion": "slideRight",
  "component": "createLucideCornerUpLeftIcon"
};

export function createLucideCornerUpLeftIcon(root, options = {}) {
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
