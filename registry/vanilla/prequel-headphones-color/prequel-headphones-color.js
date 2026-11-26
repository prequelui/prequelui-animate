import { createPrequelHeadphonesIcon } from "./prequel-headphones.js";

export function createPrequelHeadphonesColorIcon(root, options = {}) {
  const controller = createPrequelHeadphonesIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
