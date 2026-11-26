import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "credit-card",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 14h2"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "20",
        "height": "14",
        "x": "2",
        "y": "5",
        "rx": "2"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "2",
        "x2": "22",
        "y1": "10",
        "y2": "10"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-credit-card",
  "family": "lucide",
  "name": "credit-card",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucideCreditCardIcon"
};

export function createLucideCreditCardIcon(root, options = {}) {
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
