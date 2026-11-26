import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "music-note-01",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 9.5C7 10.8807 5.88071 12 4.5 12C3.11929 12 2 10.8807 2 9.5C2 8.11929 3.11929 7 4.5 7C5.88071 7 7 8.11929 7 9.5ZM7 9.5V2C7.33333 2.5 7.6 4.6 10 5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 19.5L13 11C13 10.09 13 9.63502 13.2466 9.35248C13.4932 9.06993 13.9938 9.00163 14.9949 8.86504C18.0085 8.45385 20.2013 7.19797 21.3696 6.42937C21.6498 6.24509 21.7898 6.15295 21.8949 6.20961C22 6.26627 22 6.43179 22 6.76283V17.9259"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 13C17.8 13 21 10.6667 22 10"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "10.5",
        "cy": "19.5",
        "r": "2.5"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "20",
        "cy": "18",
        "r": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-music-note-01",
  "family": "hugeicons",
  "name": "music-note-01",
  "category": "Media",
  "motion": "bounce",
  "component": "createHugeiconsMusicNote01Icon"
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

export function createHugeiconsMusicNote01Icon(root, options = {}) {
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
