import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "mail-open",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "mail",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "lucide-mail-open",
  "family": "lucide",
  "name": "mail-open",
  "category": "Communication",
  "motion": "mail",
  "component": "createLucideMailOpenIcon"
};

export function createLucideMailOpenIcon(root, options = {}) {
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
