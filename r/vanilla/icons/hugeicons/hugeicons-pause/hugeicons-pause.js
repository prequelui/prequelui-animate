import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "pause",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "press",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-pause",
  "family": "hugeicons",
  "name": "pause",
  "category": "Media",
  "motion": "press",
  "component": "createHugeiconsPauseIcon"
};

export function createHugeiconsPauseIcon(root, options = {}) {
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
