import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "smartphone-wifi",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8 6C6.37274 6.02975 5.43781 6.1682 4.80546 6.81237C4 7.63289 4 8.9535 4 11.5947V16.3971C4 19.0384 4 20.359 4.80546 21.1795C5.61091 22 6.90728 22 9.5 22C12.0927 22 13.3891 22 14.1945 21.1795C15 20.359 15 19.0384 15 16.3971V13.4958"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.5 6.8647C13.2106 6.2981 14.0929 5.99038 15.0018 5.9922C15.9106 5.99401 16.7917 6.30527 17.5 6.8747M15 10H15.01M10 3.755C11.4189 2.61897 13.1824 2 15 2C16.8176 2 18.5811 2.61897 20 3.755"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 19H10"
      }
    }
  ],
  "accents": [
    1,
    2
  ]
};

export const meta = {
  "slug": "hugeicons-smartphone-wifi",
  "family": "hugeicons",
  "name": "smartphone-wifi",
  "category": "Media",
  "motion": "shake",
  "component": "createHugeiconsSmartphoneWifiIcon"
};

export function createHugeiconsSmartphoneWifiIcon(root, options = {}) {
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
