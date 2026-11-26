import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "mail",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "mail",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7l9 6l9 -6"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-mail",
  "family": "tabler",
  "name": "mail",
  "category": "Communication",
  "motion": "mail",
  "component": "createTablerMailIcon"
};

export function createTablerMailIcon(root, options = {}) {
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
