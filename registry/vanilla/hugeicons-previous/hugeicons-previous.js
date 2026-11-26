import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "previous",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8.06492 12.6258C8.31931 13.8374 9.67295 14.7077 12.3802 16.4481C15.3247 18.3411 16.797 19.2876 17.9895 18.9229C18.3934 18.7994 18.7654 18.5823 19.0777 18.2876C20 17.4178 20 15.6118 20 12C20 8.38816 20 6.58224 19.0777 5.71235C18.7654 5.41773 18.3934 5.20057 17.9895 5.07707C16.797 4.71243 15.3247 5.6589 12.3802 7.55186C9.67295 9.29233 8.31931 10.1626 8.06492 11.3742C7.97836 11.7865 7.97836 12.2135 8.06492 12.6258Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 4L4 20"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-previous",
  "family": "hugeicons",
  "name": "previous",
  "category": "Media",
  "motion": "bounce",
  "component": "createHugeiconsPreviousIcon"
};

export function createHugeiconsPreviousIcon(root, options = {}) {
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
