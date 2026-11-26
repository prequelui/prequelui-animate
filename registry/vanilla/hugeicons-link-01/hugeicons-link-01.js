import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

export const definition = {
  "name": "link-01",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9.14339 10.691L9.35031 10.4841C11.329 8.50532 14.5372 8.50532 16.5159 10.4841C18.4947 12.4628 18.4947 15.671 16.5159 17.6497L13.6497 20.5159C11.671 22.4947 8.46279 22.4947 6.48405 20.5159C4.50532 18.5372 4.50532 15.329 6.48405 13.3503L6.9484 12.886"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17.0516 11.114L17.5159 10.6497C19.4947 8.67095 19.4947 5.46279 17.5159 3.48405C15.5372 1.50532 12.329 1.50532 10.3503 3.48405L7.48405 6.35031C5.50532 8.32904 5.50532 11.5372 7.48405 13.5159C9.46279 15.4947 12.671 15.4947 14.6497 13.5159L14.8566 13.309"
      }
    }
  ],
  "accents": [
    1
  ]
};

export const meta = {
  "slug": "hugeicons-link-01",
  "family": "hugeicons",
  "name": "link-01",
  "category": "Communication",
  "motion": "orbit",
  "component": "createHugeiconsLink01Icon"
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

export function createHugeiconsLink01Icon(root, options = {}) {
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
