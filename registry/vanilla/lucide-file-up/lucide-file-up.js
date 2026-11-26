import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "file-up",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 2v5a1 1 0 0 0 1 1h5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m15 15-3-3-3 3"
      }
    }
  ],
  "accents": [
    1,
    2,
    3
  ]
};

export const meta = {
  "slug": "lucide-file-up",
  "family": "lucide",
  "name": "file-up",
  "category": "Files",
  "motion": "file",
  "component": "createLucideFileUpIcon"
};

export function createLucideFileUpIcon(root, options = {}) {
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
