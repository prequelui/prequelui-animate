import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "ticket",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 5v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 17v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M13 11v2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-ticket",
  "family": "lucide",
  "name": "ticket",
  "category": "Commerce",
  "motion": "coin",
  "component": "createLucideTicketIcon"
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

export function createLucideTicketIcon(root, options = {}) {
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
