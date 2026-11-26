import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "printer",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-printer",
  "family": "tabler",
  "name": "printer",
  "category": "Files",
  "motion": "file",
  "component": "createTablerPrinterIcon"
};

export function createTablerPrinterIcon(root, options = {}) {
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
