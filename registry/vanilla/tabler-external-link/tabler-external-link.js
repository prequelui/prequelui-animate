import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "external-link",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 13l9 -9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 4h5v5"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "tabler-external-link",
  "family": "tabler",
  "name": "external-link",
  "category": "Interface",
  "motion": "orbit",
  "component": "createTablerExternalLinkIcon"
};

export function createTablerExternalLinkIcon(root, options = {}) {
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
