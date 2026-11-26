import { createPrequelMapPinIcon } from "./prequel-map-pin.js";

export function createPrequelMapPinSolidIcon(root, options = {}) {
  const controller = createPrequelMapPinIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
