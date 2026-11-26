import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "key-01",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "lock",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15.5 14.5C18.8137 14.5 21.5 11.8137 21.5 8.5C21.5 5.18629 18.8137 2.5 15.5 2.5C12.1863 2.5 9.5 5.18629 9.5 8.5C9.5 9.38041 9.68962 10.2165 10.0303 10.9697L2.5 18.5V21.5H5.5V19.5H7.5V17.5H9.5L13.0303 13.9697C13.7835 14.3104 14.6196 14.5 15.5 14.5Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17.5 6.5L16.5 7.5"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-key-01",
  "family": "hugeicons",
  "name": "key-01",
  "category": "Status",
  "motion": "lock",
  "component": "createHugeiconsKey01Icon"
};

export function createHugeiconsKey01Icon(root, options = {}) {
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
