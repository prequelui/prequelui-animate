import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "lock-open",
  "category": "Status",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "lock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "phosphor-lock-open",
  "family": "phosphor",
  "name": "lock-open",
  "category": "Status",
  "motion": "lock",
  "component": "createPhosphorLockOpenIcon"
};

export function createPhosphorLockOpenIcon(root, options = {}) {
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
