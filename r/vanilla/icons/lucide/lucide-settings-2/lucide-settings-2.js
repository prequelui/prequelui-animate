import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "settings-2",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M14 17H5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 7h-9"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "17",
        "cy": "17",
        "r": "3"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "7",
        "cy": "7",
        "r": "3"
      }
    }
  ],
  "accents": [
    0,
    1,
    3
  ]
};

export const meta = {
  "slug": "lucide-settings-2",
  "family": "lucide",
  "name": "settings-2",
  "category": "Interface",
  "motion": "gear",
  "component": "createLucideSettings2Icon"
};

export function createLucideSettings2Icon(root, options = {}) {
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
