import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "monitor",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "rect",
      "attrs": {
        "width": "20",
        "height": "14",
        "x": "2",
        "y": "3",
        "rx": "2"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "8",
        "x2": "16",
        "y1": "21",
        "y2": "21"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "12",
        "x2": "12",
        "y1": "17",
        "y2": "21"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-monitor",
  "family": "lucide",
  "name": "monitor",
  "category": "Media",
  "motion": "bounce",
  "component": "createLucideMonitorIcon"
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

export function createLucideMonitorIcon(root, options = {}) {
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
