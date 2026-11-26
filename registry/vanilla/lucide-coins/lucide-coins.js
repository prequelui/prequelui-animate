import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "coins",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M13.744 17.736a6 6 0 1 1-7.48-7.48"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6h1v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m6.134 14.768.866-.5 2 3.464"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "16",
        "cy": "8",
        "r": "6"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-coins",
  "family": "lucide",
  "name": "coins",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucideCoinsIcon"
};

export function createLucideCoinsIcon(root, options = {}) {
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
