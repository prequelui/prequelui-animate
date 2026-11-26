import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "radio",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16.247 7.761a6 6 0 0 1 0 8.478"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.075 4.933a10 10 0 0 1 0 14.134"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.925 19.067a10 10 0 0 1 0-14.134"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.753 16.239a6 6 0 0 1 0-8.478"
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
  "accents": [
    0,
    1,
    2,
    3
  ]
};

export const meta = {
  "slug": "lucide-radio",
  "family": "lucide",
  "name": "radio",
  "category": "Communication",
  "motion": "chat",
  "component": "createLucideRadioIcon"
};

export function createLucideRadioIcon(root, options = {}) {
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
