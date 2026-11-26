import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "microphone",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9 5a3 3 0 0 1 3 -3a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3a3 3 0 0 1 -3 -3l0 -5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 10a7 7 0 0 0 14 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 21l8 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 17l0 4"
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
  "slug": "tabler-microphone",
  "family": "tabler",
  "name": "microphone",
  "category": "Media",
  "motion": "shake",
  "component": "createTablerMicrophoneIcon"
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

export function createTablerMicrophoneIcon(root, options = {}) {
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
