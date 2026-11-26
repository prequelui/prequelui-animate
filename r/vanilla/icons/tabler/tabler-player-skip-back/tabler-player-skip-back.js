import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "player-skip-back",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20 5v14l-12 -7l12 -7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 5l0 14"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "tabler-player-skip-back",
  "family": "tabler",
  "name": "player-skip-back",
  "category": "Media",
  "motion": "press",
  "component": "createTablerPlayerSkipBackIcon"
};

export const defaults = {
  size: 28,
  className: "",
  label: "",
  speed: 1,
  delay: 0,
  loop: false,
  animate: false,
  animateOnHover: true,
  animateOnTap: true,
  animateOnView: false,
  animateOnViewOnce: true,
  animation: "hover",
};

export function createTablerPlayerSkipBackIcon(root, options = {}) {
  let current = { ...defaults, ...options };
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
