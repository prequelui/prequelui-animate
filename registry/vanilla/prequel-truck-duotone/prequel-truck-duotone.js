import { createPrequelDeliveryTruckIcon } from "./prequel-truck.js";

export function createPrequelDeliveryTruckDuotoneIcon(root, options = {}) {
  const controller = createPrequelDeliveryTruckIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
