import { createPrequelShoppingBagIcon } from "./prequel-bag.js";

export function createPrequelShoppingBagSolidIcon(root, options = {}) {
  const controller = createPrequelShoppingBagIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
