import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "message-circle",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "tabler-message-circle",
  "family": "tabler",
  "name": "message-circle",
  "category": "Communication",
  "motion": "chat",
  "component": "createTablerMessageCircleIcon"
};

export function createTablerMessageCircleIcon(root, options = {}) {
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
