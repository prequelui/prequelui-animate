import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "pause",
  "category": "Media",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-pause",
  "family": "phosphor",
  "name": "pause",
  "category": "Media",
  "motion": "press",
  "component": "createPhosphorPauseIcon"
};

export function createPhosphorPauseIcon(root, options = {}) {
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
