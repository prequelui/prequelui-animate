import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "disc",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-disc",
  "family": "lucide",
  "name": "disc",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideDiscIcon"
};

export function createLucideDiscIcon(root, options = {}) {
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
