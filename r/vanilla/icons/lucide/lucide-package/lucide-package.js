import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "package",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "float",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 22V12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7.5 4.27 9 5.15"
      }
    },
    {
      "tag": "polyline",
      "attrs": {
        "points": "3.29 7 12 12 20.71 7"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-package",
  "family": "lucide",
  "name": "package",
  "category": "Files",
  "motion": "float",
  "component": "createLucidePackageIcon"
};

export function createLucidePackageIcon(root, options = {}) {
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
