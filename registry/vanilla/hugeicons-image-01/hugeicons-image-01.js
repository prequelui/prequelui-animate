import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "image-01",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "7.5",
        "cy": "7.5",
        "r": "1.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-image-01",
  "family": "hugeicons",
  "name": "image-01",
  "category": "Media",
  "motion": "bounce",
  "component": "createHugeiconsImage01Icon"
};

export function createHugeiconsImage01Icon(root, options = {}) {
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
