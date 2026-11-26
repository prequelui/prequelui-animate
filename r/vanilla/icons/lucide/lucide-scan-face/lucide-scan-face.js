import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "scan-face",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7V5a2 2 0 0 1 2-2h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 3h2a2 2 0 0 1 2 2v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 17v2a2 2 0 0 1-2 2h-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 21H5a2 2 0 0 1-2-2v-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 14s1.5 2 4 2 4-2 4-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 9h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 9h.01"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6
  ]
};

export const meta = {
  "slug": "lucide-scan-face",
  "family": "lucide",
  "name": "scan-face",
  "category": "Status",
  "motion": "shake",
  "component": "createLucideScanFaceIcon"
};

export function createLucideScanFaceIcon(root, options = {}) {
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
