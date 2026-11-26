import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "movie",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 4l0 16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 4l0 16"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 8l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 16l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12l16 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 8l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 16l4 0"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-movie",
  "family": "tabler",
  "name": "movie",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerMovieIcon"
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

export function createTablerMovieIcon(root, options = {}) {
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
