import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "paperclip",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18.1688 12L19.713 10.4558C21.4186 8.75022 21.4186 5.98485 19.713 4.27922C18.0073 2.57359 15.242 2.57359 13.5363 4.27922L4.27141 13.5442C2.56578 15.2498 2.56578 18.0152 4.27141 19.7208C5.97704 21.4264 8.7424 21.4264 10.448 19.7208L13.9224 16.2464C14.9884 15.1804 14.9884 13.4521 13.9224 12.386C12.8564 11.32 11.128 11.32 10.062 12.386L8.1318 14.3162"
      }
    }
  ],
  "accents": [
    0
  ]
};

export const meta = {
  "slug": "hugeicons-paperclip",
  "family": "hugeicons",
  "name": "paperclip",
  "category": "Files",
  "motion": "file",
  "component": "createHugeiconsPaperclipIcon"
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

export function createHugeiconsPaperclipIcon(root, options = {}) {
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
