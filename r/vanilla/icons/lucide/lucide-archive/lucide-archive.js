import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "archive",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 12h4"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "20",
        "height": "5",
        "x": "2",
        "y": "3",
        "rx": "1"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "lucide-archive",
  "family": "lucide",
  "name": "archive",
  "category": "Files",
  "motion": "file",
  "component": "createLucideArchiveIcon"
};

export function createLucideArchiveIcon(root, options = {}) {
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
