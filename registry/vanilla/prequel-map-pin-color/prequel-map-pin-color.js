import { createPrequelMapPinIcon } from "./prequel-map-pin.js";

export function createPrequelMapPinColorIcon(root, options = {}) {
  const controller = createPrequelMapPinIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
