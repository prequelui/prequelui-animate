import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "coins",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6v10c0 .888 .772 1.45 2 2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 11c0 .888 .772 1.45 2 2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-coins",
  "family": "tabler",
  "name": "coins",
  "category": "Commerce",
  "motion": "coin",
  "component": "createTablerCoinsIcon"
};

export function createTablerCoinsIcon(root, options = {}) {
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
