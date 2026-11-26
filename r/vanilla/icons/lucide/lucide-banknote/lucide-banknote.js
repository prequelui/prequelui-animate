import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "banknote",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12h.01M18 12h.01"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "2"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "20",
        "height": "12",
        "x": "2",
        "y": "6",
        "rx": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-banknote",
  "family": "lucide",
  "name": "banknote",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucideBanknoteIcon"
};

export function createLucideBanknoteIcon(root, options = {}) {
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
