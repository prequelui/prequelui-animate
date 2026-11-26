import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "paper-airplane",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "rise",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "heroicons-paper-airplane",
  "family": "heroicons",
  "name": "paper-airplane",
  "category": "Communication",
  "motion": "rise",
  "component": "createHeroiconsPaperAirplaneIcon"
};

export function createHeroiconsPaperAirplaneIcon(root, options = {}) {
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
