import { createPrequelDeliveryTruckIcon } from "./prequel-truck.js";

export function createPrequelDeliveryTruckColorIcon(root, options = {}) {
  const controller = createPrequelDeliveryTruckIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
