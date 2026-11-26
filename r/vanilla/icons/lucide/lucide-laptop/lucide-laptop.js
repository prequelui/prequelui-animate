import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "laptop",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20.054 15.987H3.946"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-laptop",
  "family": "lucide",
  "name": "laptop",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideLaptopIcon"
};

export function createLucideLaptopIcon(root, options = {}) {
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
