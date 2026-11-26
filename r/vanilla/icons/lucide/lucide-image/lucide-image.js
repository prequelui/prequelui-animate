import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "image",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "9",
        "cy": "9",
        "r": "2"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2",
        "ry": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-image",
  "family": "lucide",
  "name": "image",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideImageIcon"
};

export function createLucideImageIcon(root, options = {}) {
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
