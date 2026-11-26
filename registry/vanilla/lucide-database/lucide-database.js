import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "database",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 5V19A9 3 0 0 0 21 19V5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12A9 3 0 0 0 21 12"
      }
    },
    {
      "tag": "ellipse",
      "attrs": {
        "cx": "12",
        "cy": "5",
        "rx": "9",
        "ry": "3"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "lucide-database",
  "family": "lucide",
  "name": "database",
  "category": "Files",
  "motion": "file",
  "component": "createLucideDatabaseIcon"
};

export function createLucideDatabaseIcon(root, options = {}) {
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
