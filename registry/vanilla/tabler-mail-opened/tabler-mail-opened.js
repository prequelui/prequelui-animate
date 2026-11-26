import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "mail-opened",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "mail",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 9l9 6l9 -6l-9 -6l-9 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 19l6 -6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 13l6 6"
      }
    }
  ],
  "accents": [
    0,
    2,
    3
  ]
};

export const meta = {
  "slug": "tabler-mail-opened",
  "family": "tabler",
  "name": "mail-opened",
  "category": "Communication",
  "motion": "mail",
  "component": "createTablerMailOpenedIcon"
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

export function createTablerMailOpenedIcon(root, options = {}) {
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
