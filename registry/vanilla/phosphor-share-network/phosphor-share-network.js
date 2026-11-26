import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "share-network",
  "category": "Communication",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "phosphor-share-network",
  "family": "phosphor",
  "name": "share-network",
  "category": "Communication",
  "motion": "orbit",
  "component": "createPhosphorShareNetworkIcon"
};

export function createPhosphorShareNetworkIcon(root, options = {}) {
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
