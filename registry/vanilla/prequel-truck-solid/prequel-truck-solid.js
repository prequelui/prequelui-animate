import { createPrequelDeliveryTruckIcon } from "./prequel-truck.js";

export function createPrequelDeliveryTruckSolidIcon(root, options = {}) {
  const controller = createPrequelDeliveryTruckIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
