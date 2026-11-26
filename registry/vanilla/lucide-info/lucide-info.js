import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "info",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 16v-4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8h.01"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "10"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "lucide-info",
  "family": "lucide",
  "name": "info",
  "category": "Interface",
  "motion": "pop",
  "component": "createLucideInfoIcon"
};

export function createLucideInfoIcon(root, options = {}) {
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
