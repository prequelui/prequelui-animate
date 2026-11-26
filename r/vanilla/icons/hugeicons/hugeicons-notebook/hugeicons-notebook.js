import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "notebook",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11H13.5M10 7H17"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 2H12.5C8.72877 2 6.84314 2 5.67157 3.17158C4.5 4.34315 4.5 6.22877 4.5 10V14C4.5 17.7712 4.5 19.6569 5.67157 20.8284C6.84315 22 8.72876 22 12.5 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V10C21 6.22877 21 4.34315 19.8284 3.17157C18.6569 2 16.7712 2 13 2Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 6H3M6 12H3M6 18H3"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "hugeicons-notebook",
  "family": "hugeicons",
  "name": "notebook",
  "category": "Files",
  "motion": "file",
  "component": "createHugeiconsNotebookIcon"
};

export function createHugeiconsNotebookIcon(root, options = {}) {
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
