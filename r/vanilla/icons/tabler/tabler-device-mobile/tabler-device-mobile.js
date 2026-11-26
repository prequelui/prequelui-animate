import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "device-mobile",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11 4h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 17v.01"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-device-mobile",
  "family": "tabler",
  "name": "device-mobile",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerDeviceMobileIcon"
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

export function createTablerDeviceMobileIcon(root, options = {}) {
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
