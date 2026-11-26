import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "notebook",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 6h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 10h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 14h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 18h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 2v20"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4
  ]
};

export const meta = {
  "slug": "lucide-notebook",
  "family": "lucide",
  "name": "notebook",
  "category": "Files",
  "motion": "file",
  "component": "createLucideNotebookIcon"
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

export function createLucideNotebookIcon(root, options = {}) {
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
