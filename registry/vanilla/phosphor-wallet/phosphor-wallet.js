import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "wallet",
  "category": "Commerce",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "phosphor-wallet",
  "family": "phosphor",
  "name": "wallet",
  "category": "Commerce",
  "motion": "coin",
  "component": "createPhosphorWalletIcon"
};

export function createPhosphorWalletIcon(root, options = {}) {
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
