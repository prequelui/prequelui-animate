import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "mic-01",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 6.5C7 4.01472 9.01472 2 11.5 2C13.9853 2 16 4.01472 16 6.5V11.5C16 13.9853 13.9853 16 11.5 16C9.01472 16 7 13.9853 7 11.5V6.5Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.5 19H11.0828C7.57267 19 4.57706 16.4623 4 13M11.5 19H11.9172C15.4273 19 18.4229 16.4623 19 13M11.5 19V22"
      }
    }
  ],
  "accents": []
};

export const meta = {
  "slug": "hugeicons-mic-01",
  "family": "hugeicons",
  "name": "mic-01",
  "category": "Media",
  "motion": "bounce",
  "component": "createHugeiconsMic01Icon"
};

export function createHugeiconsMic01Icon(root, options = {}) {
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
