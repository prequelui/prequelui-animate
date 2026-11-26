import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "photo",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15 8h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "tabler-photo",
  "family": "tabler",
  "name": "photo",
  "category": "Media",
  "motion": "bounce",
  "component": "createTablerPhotoIcon"
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

export function createTablerPhotoIcon(root, options = {}) {
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
