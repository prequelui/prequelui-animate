import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "bell",
  "category": "Interface",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "ring",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-bell",
  "family": "phosphor",
  "name": "bell",
  "category": "Interface",
  "motion": "ring",
  "component": "createPhosphorBellIcon"
};

export function createPhosphorBellIcon(root, options = {}) {
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
