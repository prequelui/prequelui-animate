import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "film",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 3v18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7.5h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12h18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 16.5h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 3v18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 7.5h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 16.5h4"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-film",
  "family": "lucide",
  "name": "film",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideFilmIcon"
};

export function createLucideFilmIcon(root, options = {}) {
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
