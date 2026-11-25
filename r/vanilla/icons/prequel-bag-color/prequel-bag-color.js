import { createPrequelShoppingBagIcon } from "./prequel-bag.js";

export function createPrequelShoppingBagColorIcon(root, options = {}) {
  const controller = createPrequelShoppingBagIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
