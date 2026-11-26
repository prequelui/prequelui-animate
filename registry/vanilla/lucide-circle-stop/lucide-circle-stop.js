import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "circle-stop",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
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
      "tag": "rect",
      "attrs": {
        "x": "9",
        "y": "9",
        "width": "6",
        "height": "6",
        "rx": "1"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-circle-stop",
  "family": "lucide",
  "name": "circle-stop",
  "category": "Media",
  "motion": "press",
  "component": "createLucideCircleStopIcon"
};

export function createLucideCircleStopIcon(root, options = {}) {
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
