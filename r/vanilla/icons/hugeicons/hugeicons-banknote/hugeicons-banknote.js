import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "banknote",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 8H17M5 16H7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 5H8C5.17157 5 3.75736 5 2.87868 5.87868C2 6.75736 2 8.17157 2 11V13C2 15.8284 2 17.2426 2.87868 18.1213C3.75736 19 5.17157 19 8 19H16C18.8284 19 20.2426 19 21.1213 18.1213C22 17.2426 22 15.8284 22 13V11C22 8.17157 22 6.75736 21.1213 5.87868C20.2426 5 18.8284 5 16 5Z"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-banknote",
  "family": "hugeicons",
  "name": "banknote",
  "category": "Commerce",
  "motion": "coin",
  "component": "createHugeiconsBanknoteIcon"
};

export function createHugeiconsBanknoteIcon(root, options = {}) {
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
