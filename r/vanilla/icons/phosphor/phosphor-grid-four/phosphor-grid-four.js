import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "grid-four",
  "category": "Interface",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-grid-four",
  "family": "phosphor",
  "name": "grid-four",
  "category": "Interface",
  "motion": "pop",
  "component": "createPhosphorGridFourIcon"
};

export function createPhosphorGridFourIcon(root, options = {}) {
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
