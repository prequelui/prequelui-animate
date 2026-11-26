import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "voicemail",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "mail",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 16H18"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "6",
        "cy": "12",
        "r": "4"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "18",
        "cy": "12",
        "r": "4"
      }
    }
  ],
  "accents": [
    0,
    2
  ]
};

export const meta = {
  "slug": "hugeicons-voicemail",
  "family": "hugeicons",
  "name": "voicemail",
  "category": "Communication",
  "motion": "mail",
  "component": "createHugeiconsVoicemailIcon"
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

export function createHugeiconsVoicemailIcon(root, options = {}) {
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
