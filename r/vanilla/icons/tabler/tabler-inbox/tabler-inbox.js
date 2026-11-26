import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "inbox",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 13h3l3 3h4l3 -3h3"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-inbox",
  "family": "tabler",
  "name": "inbox",
  "category": "Communication",
  "motion": "chat",
  "component": "createTablerInboxIcon"
};

export function createTablerInboxIcon(root, options = {}) {
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
