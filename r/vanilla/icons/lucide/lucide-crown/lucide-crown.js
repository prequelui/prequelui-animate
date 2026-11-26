import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "crown",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 21h14"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-crown",
  "family": "lucide",
  "name": "crown",
  "category": "Status",
  "motion": "shake",
  "component": "createLucideCrownIcon"
};

export function createLucideCrownIcon(root, options = {}) {
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
