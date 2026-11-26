import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "moon",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "moon",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-moon",
  "family": "lucide",
  "name": "moon",
  "category": "Status",
  "motion": "moon",
  "component": "createLucideMoonIcon"
};

export function createLucideMoonIcon(root, options = {}) {
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
