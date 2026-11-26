import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "television",
  "category": "Media",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM40,80H144V200H40ZM216,200H160V80h56V200Zm-16-84a12,12,0,1,1-12-12A12,12,0,0,1,200,116Zm0,48a12,12,0,1,1-12-12A12,12,0,0,1,200,164Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-television",
  "family": "phosphor",
  "name": "television",
  "category": "Media",
  "motion": "bounce",
  "component": "createPhosphorTelevisionIcon"
};

export function createPhosphorTelevisionIcon(root, options = {}) {
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
