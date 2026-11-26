import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "archive",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M13 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V10C21 6.22876 21 4.34315 19.8284 3.17157C18.6569 2 16.7712 2 13 2Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 12H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 7H9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 17H9"
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
  "slug": "hugeicons-archive",
  "family": "hugeicons",
  "name": "archive",
  "category": "Files",
  "motion": "file",
  "component": "createHugeiconsArchiveIcon"
};

export function createHugeiconsArchiveIcon(root, options = {}) {
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
