import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "megaphone",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 6v8"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "lucide-megaphone",
  "family": "lucide",
  "name": "megaphone",
  "category": "Communication",
  "motion": "shake",
  "component": "createLucideMegaphoneIcon"
};

export function createLucideMegaphoneIcon(root, options = {}) {
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
