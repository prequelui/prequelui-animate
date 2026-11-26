import { createPrequelDeliveryTruckIcon } from "./prequel-truck.js";

export function createPrequelDeliveryTruckEmojiIcon(root, options = {}) {
  const controller = createPrequelDeliveryTruckIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
