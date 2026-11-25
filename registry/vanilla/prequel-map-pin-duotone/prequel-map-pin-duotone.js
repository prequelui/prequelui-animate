import { createPrequelMapPinIcon } from "./prequel-map-pin.js";

export function createPrequelMapPinDuotoneIcon(root, options = {}) {
  const controller = createPrequelMapPinIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
