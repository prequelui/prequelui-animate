import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "printer",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "6",
        "y": "14",
        "width": "12",
        "height": "8",
        "rx": "1"
      }
    }
  ],
  "accents": [
    0,
    1
  ]
};

export const meta = {
  "slug": "lucide-printer",
  "family": "lucide",
  "name": "printer",
  "category": "Files",
  "motion": "file",
  "component": "createLucidePrinterIcon"
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

export function createLucidePrinterIcon(root, options = {}) {
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
