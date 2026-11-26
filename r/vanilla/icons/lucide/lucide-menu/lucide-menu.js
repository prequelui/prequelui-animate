import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "menu",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 5h16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12h16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 19h16"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "lucide-menu",
  "family": "lucide",
  "name": "menu",
  "category": "Interface",
  "motion": "pop",
  "component": "createLucideMenuIcon"
};

export function createLucideMenuIcon(root, options = {}) {
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
