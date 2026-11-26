import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "video",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "2",
        "y": "6",
        "width": "14",
        "height": "12",
        "rx": "2"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "lucide-video",
  "family": "lucide",
  "name": "video",
  "category": "Communication",
  "motion": "bounce",
  "component": "createLucideVideoIcon"
};

export function createLucideVideoIcon(root, options = {}) {
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
