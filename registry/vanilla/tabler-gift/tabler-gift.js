import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "gift",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8l0 13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-gift",
  "family": "tabler",
  "name": "gift",
  "category": "Commerce",
  "motion": "coin",
  "component": "createTablerGiftIcon"
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

export function createTablerGiftIcon(root, options = {}) {
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
