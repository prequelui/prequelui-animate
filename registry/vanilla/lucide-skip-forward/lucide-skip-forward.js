import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "skip-forward",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M21 4v16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-skip-forward",
  "family": "lucide",
  "name": "skip-forward",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideSkipForwardIcon"
};

export function createLucideSkipForwardIcon(root, options = {}) {
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
