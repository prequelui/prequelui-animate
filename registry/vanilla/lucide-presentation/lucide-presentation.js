import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "presentation",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "grow",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 3h20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7 21 5-5 5 5"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "lucide-presentation",
  "family": "lucide",
  "name": "presentation",
  "category": "Media",
  "motion": "grow",
  "component": "createLucidePresentationIcon"
};

export function createLucidePresentationIcon(root, options = {}) {
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
